// Navigation functionality
document.getElementById('nav-search').addEventListener('click', function(e) {
    e.preventDefault();
    activateTab('search-entitlements', 'nav-search');
});

document.getElementById('nav-add').addEventListener('click', function(e) {
    e.preventDefault();
    activateTab('add-entitlement', 'nav-add');
});

document.getElementById('nav-update').addEventListener('click', function(e) {
    e.preventDefault();
    activateTab('update-entitlement', 'nav-update');
});

document.getElementById('nav-delete').addEventListener('click', function(e) {
    e.preventDefault();
    activateTab('delete-entitlement', 'nav-delete');
});

// Form submission handlers
// Update search form handler
document.getElementById('search-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Show loading state
    document.getElementById('search-loading').classList.add('active');
    const statusElement = document.getElementById('search-status');
    statusElement.className = 'status-message';
    statusElement.textContent = '';

    try {
        // Get search criteria
        const searchParams = {
            query: document.getElementById('search-query').value.toLowerCase(),
            type: document.getElementById('search-type').value,
            startDate: document.getElementById('search-start-date').value,
            endDate: document.getElementById('search-end-date').value
        };

        // Initialize ZAF client
        const client = ZAFClient.init();

        // Configuration (simplified since we're using ZAF client authentication)
        const CONFIG = {
            API_BASE_URL: '/api/v2',
            CUSTOM_OBJECT_ENDPOINT: '/custom_objects'
        };
        const apiUrl = `${CONFIG.API_BASE_URL}${CONFIG.CUSTOM_OBJECT_ENDPOINT}`;

        // Make authenticated request through ZAF client
        const result = await client.request({
            url: apiUrl,
            type: 'GET',
            dataType: 'json'
        });

        console.log('13', result);

        // Update results table
        const resultsBody = document.getElementById('search-results');
        resultsBody.innerHTML = result.custom_objects.map(record => `
            <tr>
                <td>${record.key}</td>
                <td>${record.title}</td>
                <td>${record.description}</td>
                <td>${record.url}</td>
                <td>${new Date(record.created_at).toLocaleDateString()}</td>
                <td class="action-buttons">
                    <button class="action-button action-button--edit">Edit</button>
                    <button class="action-button action-button--delete">Delete</button>
                </td>
            </tr>
        `).join('');

        // Update status
        if (result.length === 0) {
            statusElement.textContent = 'No matching entitlements found';
            statusElement.classList.add('error');
        }

    } catch (error) {
        console.error('Search failed:', error);
        statusElement.textContent = `Error searching entitlements: ${error.message}`;
        statusElement.classList.add('error');
    } finally {
        document.getElementById('search-loading').classList.remove('active');
    }
});

// Add entitlement form handler
document.querySelector('#add-entitlement form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const addData = {
        name: document.getElementById('add-entitlement-name').value,
        type: document.getElementById('add-entitlement-type').value,
        value: document.getElementById('add-entitlement-value').value,
        expirationDate: document.getElementById('add-expiration-date').value
    };
    
    const client = ZAFClient.init();
    const CONFIG = {
        API_BASE_URL: '/api/v2',
        CUSTOM_OBJECT_ENDPOINT: '/custom_objects'
    };
    const apiUrl = `${CONFIG.API_BASE_URL}${CONFIG.CUSTOM_OBJECT_ENDPOINT}`;

    // Make authenticated request through ZAF client
    const result = await client.request({
        url: apiUrl,
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify({
            "custom_object": {
                "key": "apartment",
                "title": "Apartment",
                "title_pluralized": "Apartments"
            }
        })
    });
});

// Update entitlement form handler
document.querySelector('#update-entitlement form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const updateData = {
        id: document.getElementById('update-entitlement-id').value,
        name: document.getElementById('update-entitlement-name').value,
        type: document.getElementById('update-entitlement-type').value,
        value: document.getElementById('update-entitlement-value').value,
        expirationDate: document.getElementById('update-expiration-date').value
    };
    
    const client = ZAFClient.init();
    const CONFIG = {
        API_BASE_URL: '/api/v2',
        CUSTOM_OBJECT_ENDPOINT: '/custom_objects'
    };
    const apiUrl = `${CONFIG.API_BASE_URL}${CONFIG.CUSTOM_OBJECT_ENDPOINT}`;

    // Make authenticated request through ZAF client
    const result = await client.request({
        url: apiUrl,
        type: 'PUT',
        dataType: 'json',
        data: JSON.stringify({
            "custom_object": {
                "key": "apartment",
                "title": "Apartment",
                "title_pluralized": "Apartments"
            }
        })
    });
});

// Delete entitlement form handler
document.querySelector('#delete-entitlement form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const id = document.getElementById('delete-entitlement-id').value;
    
    const client = ZAFClient.init();
    const CONFIG = {
        API_BASE_URL: '/api/v2',
        CUSTOM_OBJECT_ENDPOINT: '/custom_objects'
    };
    const apiUrl = `${CONFIG.API_BASE_URL}${CONFIG.CUSTOM_OBJECT_ENDPOINT}`;

    // Make authenticated request through ZAF client
    const result = await client.request({
        url: apiUrl,
        type: 'DELETE',
        dataType: 'json',
        data: JSON.stringify({
            "custom_object": {
                "key": "apartment",
                "title": "Apartment",
                "title_pluralized": "Apartments"
            }
        })
    });
});

function activateTab(sectionId, navId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(function(section) {
        section.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Update nav active state
    document.querySelectorAll('.navbar a').forEach(function(navItem) {
        navItem.classList.remove('active');
    });
    
    document.getElementById(navId).classList.add('active');
}

// Edit button functionality
document.querySelectorAll('.action-button--edit').forEach(function(button) {
    button.addEventListener('click', function() {
        // Get the row data
        const row = this.closest('tr');
        const id = row.cells[0].textContent;
        const name = row.cells[1].textContent;
        const type = row.cells[2].textContent.toLowerCase();
        const value = row.cells[3].textContent;
        const expiration = row.cells[4].textContent;
        
        // Activate update tab
        activateTab('update-entitlement', 'nav-update');
        
        // Fill the form with data
        document.getElementById('update-entitlement-id').value = id;
        document.getElementById('update-entitlement-name').value = name;
        document.getElementById('update-entitlement-value').value = value;
        document.getElementById('update-expiration-date').value = expiration;
        
        // Set select value
        const selectElement = document.getElementById('update-entitlement-type');
        for (let i = 0; i < selectElement.options.length; i++) {
            if (selectElement.options[i].value === type) {
                selectElement.selectedIndex = i;
                break;
            }
        }
    });
});

// Delete button functionality
document.querySelectorAll('.action-button--delete').forEach(function(button) {
    button.addEventListener('click', function() {
        // Get the row data
        const row = this.closest('tr');
        const id = row.cells[0].textContent;
        
        // Activate delete tab
        activateTab('delete-entitlement', 'nav-delete');
        
        // Fill the form with data
        document.getElementById('delete-entitlement-id').value = id;
    });
});