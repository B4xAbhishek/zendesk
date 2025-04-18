// Initialize the Zendesk Client
const client = ZAFClient.init();

// Store ticket fields mapping
let ticketFields = [];

// Store form fields
let formFields = [];

//Store all tickets and export to excel 
let allTickets = []

// App settings
let settings = {
  formId: null,
  maxTickets: 50
};

document.getElementById('exportBtn').addEventListener('click', async function () {
  const checkedBoxes = document.querySelectorAll('input[type="checkbox"]:checked');
  
  if (checkedBoxes.length === 0) {
    alert('Please select at least one ticket to export!');
    return;
  }

  showLoader();
  try {
    // Get checked tickets
    const checkedTickets = Array.from(checkedBoxes).map(checkbox => 
      allTickets.find(ticket => ticket.id.toString() === checkbox.dataset.ticketId)
    ).filter(Boolean);

    // Create a workbook
    const workbook = XLSX.utils.book_new();

    // Process each ticket into its own worksheet
    for (const ticket of checkedTickets) {
      const sheetData = [];
      
      // Get requester and organization names
      const requesterName = await fetchUserName(ticket.requester_id);
      const orgName = ticket.organization_id ? await fetchOrgName(ticket.organization_id) : 'N/A';

      // Add system fields
      sheetData.push(
        ['Ticket ID', ticket.id],
        ['Subject', ticket.subject],
        ['Status', ticket.status],
        ['Requester', requesterName],
        ['Organization', orgName],
        ['Created At', new Date(ticket.created_at).toLocaleString()],
        ['Updated At', new Date(ticket.updated_at).toLocaleString()],
        [] // Empty row for spacing
      );

      // Add custom form fields
      for (const field of formFields) {
        // Skip system fields
        if (['subject', 'status', 'priority', 'assignee'].includes(field.key)) continue;

        const value = getFormattedFieldValue(ticket, field);
        
        // Check if field title starts with special format (e.g., fj_b2_)
        const fieldTitle = field.title;
        const cellRef = fieldTitle.match(/^fj_([a-z0-9]+)_/i);
        
        if (cellRef) {
          // Extract the cell reference and the actual field name
          const [, cellLocation] = cellRef;
          const actualFieldName = fieldTitle.replace(/^fj_[a-z0-9]+_/i, '');
          sheetData.push([`${cellLocation.toUpperCase()} - ${actualFieldName}`, value]);
        } else {
          sheetData.push([fieldTitle, value]);
        }
      }

      // Create worksheet
      const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

      // Auto-size columns
      const maxLen = Math.max(...sheetData.map(row => row[0]?.toString().length || 0));
      worksheet['!cols'] = [{ wch: maxLen + 2 }, { wch: 50 }];

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, `Ticket ${ticket.id}`);
    }

    // Save workbook
    XLSX.writeFile(workbook, "Fujitsu_Onboarding_Tickets.xlsx");

    // Remove fujitsu_onboarding tag from exported tickets
    for (const ticket of checkedTickets) {
      try {
        const response = await client.request({
          url: `/api/v2/tickets/${ticket.id}.json`,
          type: 'PUT',
          data: {
            ticket: {
              tags: ticket.tags.filter(tag => tag !== 'fujitsu_onboarding')
            }
          }
        });
        console.log(`Removed fujitsu_onboarding tag from ticket ${ticket.id}`);
      } catch (error) {
        console.error(`Failed to remove tag from ticket ${ticket.id}:`, error);
      }
    }

    // Refresh the ticket list
    await searchOnboardingTickets();

  } catch (error) {
    console.error('Export error:', error);
    alert('Failed to export tickets. Please try again.');
  } finally {
    hideLoader();
  }
});

function showLoader() {
  document.getElementById('loader').style.display = 'block';
  document.getElementById('ticketList').innerHTML = '';
  document.getElementById('noTickets').style.display = 'none';
  document.getElementById('error').textContent = '';
}

function hideLoader() {
  document.getElementById('loader').style.display = 'none';
}

function showError(message) {
  document.getElementById('error').textContent = message;
  hideLoader();
}

// Fetch app settings (form ID and max tickets) -- add tag_name to settings in case we ever want to reuse this code
async function fetchSettings() {
  return new Promise((resolve) => {
    client.metadata().then((metadata) => {
      if (metadata.settings) {
        settings.formId = parseInt(metadata.settings.form_id, 10);
        settings.maxTickets = parseInt(metadata.settings.max_tickets, 10) || 50;

        // Show form ID in the UI
        const appInfoElement = document.getElementById('appInfo');
        appInfoElement.textContent = `Form ID: ${settings.formId} (Limit: ${settings.maxTickets} tickets)`;
      } else {
        showError('App settings not configured. Please set Form ID in the app settings.');
      }
      resolve(settings);
    });
  });
}

// Fetch ticket fields and their IDs
async function fetchTicketFields() {
  try {
    const response = await client.request({
      url: '/api/v2/ticket_fields.json',
      type: 'GET'
    });

    // Store complete field definitions including options for dropdowns, etc.
    ticketFields = response.ticket_fields.map(field => ({
      id: field.id,
      type: field.type,
      title: field.title,
      key: field.key || field.title.toLowerCase().replace(/\s+/g, '_'),
      options: field.custom_field_options || field.system_field_options || []
    }));

    return ticketFields;
  } catch (error) {
    console.error('Error fetching ticket fields:', error);
    showError('Failed to load ticket fields. Please refresh.');
    return [];
  }
}

// Fetch form fields based on form ID
async function fetchFormFields(formId) {
  if (!formId) {
    showError('No form ID configured. Please set Form ID in the app settings.');
    return [];
  }

  try {
    const response = await client.request({
      url: `/api/v2/ticket_forms/${formId}.json`,
      type: 'GET'
    });

    if (response.ticket_form && response.ticket_form.ticket_field_ids) {
      // Get the IDs of fields used in this form
      const fieldIds = response.ticket_form.ticket_field_ids;

      // Filter ticketFields to only include those in the form
      formFields = ticketFields.filter(field => fieldIds.includes(field.id));

      console.log(`Form ${formId} fields:`, formFields);

      // Check if we found form fields
      if (formFields.length === 0) {
        console.warn(`Form ${formId} has fields in the API response, but none matched our ticketFields array.`);
      }
      
      return formFields;
    } else {
      showError(`Form ID ${formId} not found or has no fields`);
      return [];
    }
  } catch (error) {
    console.error(`Error fetching form ${formId}:`, error);
    showError(`Failed to load form ${formId}. Please check the Form ID and try again.`);
    return [];
  }
}

// Get field value by ID from ticket
function getFieldValue(ticket, fieldId) {
  // Try the custom_fields array first (most reliable source)
  if (ticket.custom_fields && Array.isArray(ticket.custom_fields)) {
    const customField = ticket.custom_fields.find(f => f.id === fieldId);
    if (customField !== undefined && customField.value !== undefined) {
      return customField.value;
    }
  }
  
  // Try the fields array next
  if (ticket.fields && Array.isArray(ticket.fields)) {
    const field = ticket.fields.find(f => f.id === fieldId);
    if (field !== undefined && field.value !== undefined) {
      return field.value;
    }
  }
  
  // Then try direct properties (for backward compatibility)
  const fieldKey = `custom_fields_${fieldId}`;
  if (ticket[fieldKey] !== undefined) {
    return ticket[fieldKey];
  }
  
  // Try alternate format
  const altFieldKey = `custom_field_${fieldId}`;
  if (ticket[altFieldKey] !== undefined) {
    return ticket[altFieldKey];
  }
  
  return 'N/A';
}

// Function to get a field's display value based on its type and raw value
function getFormattedFieldValue(ticket, field) {
  // Get the raw value from the ticket
  const rawValue = getFieldValue(ticket, field.id);
  
  // If no value, return N/A
  if (rawValue === null || rawValue === undefined || rawValue === '' || rawValue === 'N/A') {
    return 'N/A';
  }
  
  // Format based on field type
  switch (field.type) {
    case 'checkbox':
      return rawValue === true || rawValue === 'true' || rawValue === 1 ? 'Yes' : 'No';
      
    case 'date':
      try {
        return new Date(rawValue).toLocaleDateString();
      } catch (e) {
        return rawValue;
      }
      
    case 'datetime':
      try {
        return new Date(rawValue).toLocaleString();
      } catch (e) {
        return rawValue;
      }
      
    case 'tagger':
    case 'tickettype':
    case 'priority':
    case 'lookup':
    case 'multiselect':
      // These field types often have option IDs that need to be looked up
      // Try to find the title for the given value from field options
      if (field.options && Array.isArray(field.options)) {
        const option = field.options.find(opt => opt.value == rawValue);
        if (option) {
          return option.name || option.label || rawValue;
        }
      }
      return rawValue;
      
    default:
      return rawValue;
  }
}

// Function to read user name from user ID data
async function fetchUserName(userId) {
  try {
    const response = await client.request({
      url: `/api/v2/users/${userId}.json`,
      type: 'GET'
    });
    return response.user.name || 'Unknown';
  } catch (error) {
    console.error('Error fetching user name:', error);
    return 'Unknown';
  }
}

// Function to read organization name from organization ID data
async function fetchOrgName(orgId) {
  try {
    const response = await client.request({
      url: `/api/v2/organizations/${orgId}.json`,
      type: 'GET'
    });
    return response.organization.name || 'Unknown';
  } catch (error) {
    console.error('Error fetching organization name:', error);
    return 'Unknown';
  }
}

// Search for tickets with the fujitsu_onboarding tag
async function searchOnboardingTickets() {
  showLoader();
  
  try {
    // First, fetch tickets using the search API
    const searchResponse = await client.request({
      url: '/api/v2/search.json',
      type: 'GET',
      data: {
        query: `type:ticket tags:fujitsu_onboarding`,
        per_page: settings.maxTickets
      }
    });
    
    if (!searchResponse.results || searchResponse.results.length === 0) {
      document.getElementById('noTickets').style.display = 'block';
      hideLoader();
      return;
    }
    
    console.log(`Found ${searchResponse.results.length} tickets with fujitsu_onboarding tag`);
    
    // For each ticket in search results, fetch ticket data to get all fields
    const ticketPromises = searchResponse.results.map(async (searchResult) => {
      try {
        // Get complete ticket data
        const fullTicketResponse = await client.request({
          url: `/api/v2/tickets/${searchResult.id}.json`,
          type: 'GET'
        });
        
        // Log the first ticket's structure to help with debugging
        if (searchResult.id === searchResponse.results[0].id) {
          console.log('First full ticket data structure:', fullTicketResponse.ticket);
        }
        
        return fullTicketResponse.ticket;
      } catch (error) {
        console.error(`Error fetching complete data for ticket ${searchResult.id}:`, error);
        // Return the search result as fallback
        return searchResult;
      }
    });
    
    // Wait for all ticket data to be fetched
    const fullTickets = await Promise.all(ticketPromises);
    allTickets = fullTickets;
    // Display the tickets with complete data
    await displayTickets(fullTickets);
    
  } catch (error) {
    console.error('Error searching tickets:', error);
    showError('Failed to search for tickets. Please try again.');
  } finally {
    hideLoader();
  }
}

// Display tickets in the UI
async function displayTickets(tickets) {
  const ticketListElement = document.getElementById('ticketList');
  ticketListElement.innerHTML = '';

  if (!Array.isArray(tickets) || tickets.length === 0) {
    console.error('No tickets provided to displayTickets function or tickets is not an array');
    document.getElementById('noTickets').style.display = 'block';
    return;
  }
  // Sort tickets alphabetically by subject
  tickets.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
  console.log('351', tickets)

  // Process each ticket asynchronously
  const ticketPromises = tickets.map(async (ticket, index) => {
    
    const ticketCard = document.createElement('div');
    ticketCard.className = 'ticket-card';

    // Add checkbox
    const checkboxDiv = document.createElement('div');
    checkboxDiv.className = 'ticket-checkbox';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `ticket-${ticket.id}`;
    checkbox.dataset.ticketId = ticket.id;
    checkboxDiv.appendChild(checkbox);
    ticketCard.appendChild(checkboxDiv);
    
    // Create ticket ID with link
    const ticketIdElement = document.createElement('a');
    ticketIdElement.className = 'ticket-id';
    ticketIdElement.href = `#`;
    ticketIdElement.textContent = `#${ticket.id}: ${ticket.subject}`;
    ticketIdElement.onclick = function(e) {
      e.preventDefault();
      client.invoke('routeTo', 'ticket', ticket.id);
    };
    
    // Create user info element
    const userElement = document.createElement('div');
    userElement.className = 'ticket-user';
    
    // Fetch requester and organization info
    const requesterInfo = await fetchUserName(ticket.requester_id);
    if (ticket.organization_id) {
      const orgName = await fetchOrgName(ticket.organization_id);
      userElement.textContent = `Requester: ${requesterInfo} (${orgName})`;
    } else {
      userElement.textContent = `Requester: ${requesterInfo}`;
    }
    
    // Add status information
    const statusElement = document.createElement('div');
    statusElement.textContent = `Status: ${ticket.status}`;
    
    // Add created/updated dates
    const datesElement = document.createElement('div');
    const created = new Date(ticket.created_at).toLocaleString();
    const updated = new Date(ticket.updated_at).toLocaleString();
    datesElement.textContent = `Created: ${created} | Updated: ${updated}`;
    
    // Append basic elements to the ticket card
    ticketCard.appendChild(ticketIdElement);
    ticketCard.appendChild(userElement);
    ticketCard.appendChild(statusElement);
    ticketCard.appendChild(datesElement);
    
    // Add custom fields from the selected form
    if (formFields && formFields.length > 0) {
      const customFieldsElement = document.createElement('div');
      customFieldsElement.className = 'custom-fields';
      
      let hasCustomFieldValues = false;
      
      // Process each field from the form
      for (const field of formFields) {
        // Skip system fields that aren't custom fields
        if (['subject', 'description', 'status', 'priority', 'assignee'].includes(field.key)) {
          continue;
        }
        
        // Get the formatted display value for this field
        const displayValue = getFormattedFieldValue(ticket, field);
        
        // Debug output for field value detection
        console.log(`Ticket #${ticket.id} - Field ${field.id} (${field.title}): `, {
          displayValue: displayValue,
          fieldType: field.type
        });
        
        if (displayValue !== 'N/A') {
          hasCustomFieldValues = true;
          
          const fieldElement = document.createElement('div');
          fieldElement.className = 'custom-field';
          
          const fieldNameSpan = document.createElement('span');
          fieldNameSpan.className = 'field-name';
          fieldNameSpan.textContent = `${field.title}: `;
          
          const fieldValueSpan = document.createElement('span');
          fieldValueSpan.className = 'field-value';
          fieldValueSpan.textContent = displayValue;
          
          fieldElement.appendChild(fieldNameSpan);
          fieldElement.appendChild(fieldValueSpan);
          customFieldsElement.appendChild(fieldElement);
        }
      }
      
      if (hasCustomFieldValues) {
        ticketCard.appendChild(customFieldsElement);
      } else {
        console.log(`Ticket #${ticket.id} - No custom field values found from form ${settings.formId}`);
      }
    } else {
      console.log(`No form fields available for form ID ${settings.formId}`);
    }
    
    return ticketCard;
  });
  
  try {
    // Wait for all ticket promises to resolve
    const ticketCards = await Promise.all(ticketPromises);
    console.log(`Created ${ticketCards.length} ticket cards, adding to DOM`);
    
    // Add all ticket cards to the document
    ticketCards.forEach(card => {
      ticketListElement.appendChild(card);
    });
    
    console.log('All tickets displayed successfully');
  } catch (error) {
    console.error('Error displaying tickets:', error);
    showError('Failed to display tickets. Please try again.');
  }
}

// Initialize the app
async function initApp() {
  try {
    // Load app settings
    await fetchSettings();

    if (!settings.formId) {
      showError('Form ID not configured. Please set a Form ID in the app settings.');
      return;
    }

    // Load all ticket fields first
    await fetchTicketFields();

    // Then load form fields based on the form ID
    await fetchFormFields(settings.formId);

    // Finally, search and display tickets
    await searchOnboardingTickets();

    console.log('App initialization complete');
  } catch (error) {
    console.error('Failed to initialize app:', error);
    showError('Failed to initialize the app. Please refresh the page.');
  }
}

// Set up refresh button
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('refreshBtn').addEventListener('click', function() {
    searchOnboardingTickets();
  });

  // Initialize the app
  initApp();
});