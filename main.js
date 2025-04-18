// Zendesk API helper functions
const ZendeskAPI = {
    client: null,
    CONFIG: {
        API_BASE_URL: '/api/v2',
        CUSTOM_OBJECT_ENDPOINT: '/custom_objects'
    },

    init() {
        if (!this.client) {
            this.client = ZAFClient.init();
        }
        return this.client;
    },

    // Contract API Methods
    async searchContracts(searchParams) {
        const client = this.init();
        const apiUrl = `${this.CONFIG.API_BASE_URL}/contracts`;
        
        return await client.request({
            url: apiUrl,
            type: 'GET',
            dataType: 'json',
            data: searchParams
        });
    },

    async addContract(contractData) {
        const client = this.init();
        const apiUrl = `${this.CONFIG.API_BASE_URL}/contracts`;
        
        return await client.request({
            url: apiUrl,
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify({
                contract: {
                    number: contractData.number,
                    name: contractData.name,
                    vendor: contractData.vendor,
                    reseller: contractData.reseller,
                    sapResellerId: contractData.sapResellerId,
                    endUser: contractData.endUser,
                    sapEndUserId: contractData.sapEndUserId,
                    salesOrder: contractData.salesOrder,
                    status: contractData.status,
                    startDate: contractData.startDate,
                    endDate: contractData.endDate,
                    dateRenewed: contractData.dateRenewed,
                    dateAccuracy: contractData.dateAccuracy,
                    priceUsd: contractData.priceUsd,
                    vendorPriceUsd: contractData.vendorPriceUsd,
                    backContractPo: contractData.backContractPo,
                    webOrderId: contractData.webOrderId,
                    resellerCountry: contractData.resellerCountry,
                    endUserCountry: contractData.endUserCountry,
                    creationSource: contractData.creationSource
                }
            })
        });
    },

    async updateContract(contractData) {
        const client = this.init();
        const apiUrl = `${this.CONFIG.API_BASE_URL}/contracts/${contractData.number}`;
        
        return await client.request({
            url: apiUrl,
            type: 'PUT',
            dataType: 'json',
            data: JSON.stringify({
                contract: {
                    name: contractData.name,
                    vendor: contractData.vendor,
                    reseller: contractData.reseller,
                    sapResellerId: contractData.sapResellerId,
                    endUser: contractData.endUser,
                    sapEndUserId: contractData.sapEndUserId,
                    salesOrder: contractData.salesOrder,
                    status: contractData.status,
                    startDate: contractData.startDate,
                    endDate: contractData.endDate,
                    dateRenewed: contractData.dateRenewed,
                    dateAccuracy: contractData.dateAccuracy,
                    priceUsd: contractData.priceUsd,
                    vendorPriceUsd: contractData.vendorPriceUsd,
                    backContractPo: contractData.backContractPo,
                    webOrderId: contractData.webOrderId,
                    resellerCountry: contractData.resellerCountry,
                    endUserCountry: contractData.endUserCountry,
                    creationSource: contractData.creationSource
                }
            })
        });
    },

    async deleteContract(contractNumber) {
        const client = this.init();
        const apiUrl = `${this.CONFIG.API_BASE_URL}/contracts/${contractNumber}`;
        
        return await client.request({
            url: apiUrl,
            type: 'DELETE',
            dataType: 'json'
        });
    },

    // Entitlement API Methods
    async searchEntitlements(searchParams) {
        const client = this.init();
        const apiUrl = `${this.CONFIG.API_BASE_URL}${this.CONFIG.CUSTOM_OBJECT_ENDPOINT}`;
        
        return await client.request({
            url: apiUrl,
            type: 'GET',
            dataType: 'json'
        });
    },

    async addEntitlement(entitlementData) {
        const client = this.init();
        const apiUrl = `${this.CONFIG.API_BASE_URL}${this.CONFIG.CUSTOM_OBJECT_ENDPOINT}`;
        
        return await client.request({
            url: apiUrl,
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify({
                "custom_object": {
                    "entId": entitlementData.entId,
                    "contractId": entitlementData.contractId,
                    "project": entitlementData.project,
                    "astNumber": entitlementData.astNumber,
                    "snMac": entitlementData.snMac,
                    "entitlementData": entitlementData.entitlementData,
                    "entitlementType": entitlementData.entitlementType,
                    "reseller": entitlementData.reseller,
                    "endUser": entitlementData.endUser,
                    "salesOrder": entitlementData.salesOrder,
                    "currentPeriod": entitlementData.currentPeriod,
                    "startDate": entitlementData.startDate,
                    "expirationDate": entitlementData.expirationDate,
                    "vendor": entitlementData.vendor,
                    "productSku": entitlementData.productSku,
                    "installationDate": entitlementData.installationDate,
                    "endOfLifeDate": entitlementData.endOfLifeDate,
                    "endOfServiceDate": entitlementData.endOfServiceDate,
                    "productSkuReplacedBy": entitlementData.productSkuReplacedBy,
                    "serialNumber": entitlementData.serialNumber,
                    "quoteRef": entitlementData.quoteRef,
                    "svo": entitlementData.svo,
                    "internalPo": entitlementData.internalPo
                }
            })
        });
    },

    async updateEntitlement(updateData) {
        const client = this.init();
        const apiUrl = `${this.CONFIG.API_BASE_URL}${this.CONFIG.CUSTOM_OBJECT_ENDPOINT}/${updateData.id}`;
        
        return await client.request({
            url: apiUrl,
            type: 'PUT',
            dataType: 'json',
            data: JSON.stringify({
                "custom_object": {
                    "entId": updateData.entId,
                    "contractId": updateData.contractId,
                    "project": updateData.project,
                    "astNumber": updateData.astNumber,
                    "snMac": updateData.snMac,
                    "entitlementData": updateData.entitlementData,
                    "entitlementType": updateData.entitlementType,
                    "reseller": updateData.reseller,
                    "endUser": updateData.endUser,
                    "salesOrder": updateData.salesOrder,
                    "currentPeriod": updateData.currentPeriod,
                    "startDate": updateData.startDate,
                    "expirationDate": updateData.expirationDate,
                    "vendor": updateData.vendor,
                    "productSku": updateData.productSku,
                    "installationDate": updateData.installationDate,
                    "endOfLifeDate": updateData.endOfLifeDate,
                    "endOfServiceDate": updateData.endOfServiceDate,
                    "productSkuReplacedBy": updateData.productSkuReplacedBy,
                    "serialNumber": updateData.serialNumber,
                    "quoteRef": updateData.quoteRef,
                    "svo": updateData.svo,
                    "internalPo": updateData.internalPo
                }
            })
        });
    },

    async deleteEntitlement(id) {
        const client = this.init();
        const apiUrl = `${this.CONFIG.API_BASE_URL}${this.CONFIG.CUSTOM_OBJECT_ENDPOINT}/${id}`;
        
        return await client.request({
            url: apiUrl,
            type: 'DELETE',
            dataType: 'json'
        });
    }
};

// Main Navigation functionality
document.getElementById('nav-contracts').addEventListener('click', function(e) {
    e.preventDefault();
    activateMainSection('contracts-section', 'nav-contracts');
});

document.getElementById('nav-entitlements').addEventListener('click', function(e) {
    e.preventDefault();
    activateMainSection('entitlements-section', 'nav-entitlements');
});

// Contracts Navigation functionality
document.getElementById('nav-contract-search').addEventListener('click', function(e) {
    e.preventDefault();
    activateTab('search-contracts', 'nav-contract-search');
});

document.getElementById('nav-contract-add').addEventListener('click', function(e) {
    e.preventDefault();
    activateTab('add-contract', 'nav-contract-add');
});

document.getElementById('nav-contract-update').addEventListener('click', function(e) {
    e.preventDefault();
    activateTab('update-contract', 'nav-contract-update');
});

document.getElementById('nav-contract-delete').addEventListener('click', function(e) {
    e.preventDefault();
    activateTab('delete-contract', 'nav-contract-delete');
});

// Contract form handlers
document.getElementById('contract-search-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const loadingElement = document.getElementById('contract-search-loading');
    const statusElement = document.getElementById('contract-search-status');
    const resultsBody = document.getElementById('contract-search-results');
    
    loadingElement.classList.add('active');
    statusElement.className = 'status-message';
    statusElement.textContent = '';
    resultsBody.innerHTML = '';

    try {
        const searchParams = {
            query: document.getElementById('contract-search-query').value.trim(),
            status: document.getElementById('contract-search-status-select').value,
            startDate: document.getElementById('contract-search-start-date').value,
            endDate: document.getElementById('contract-search-end-date').value
        };

        console.log('Searching with params:', searchParams);
        const result = await ZendeskAPI.searchContracts(searchParams);
        
        if (result && result.contracts && result.contracts.length > 0) {
            result.contracts.forEach(contract => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${contract.number || '-'}</td>
                    <td>${contract.name || '-'}</td>
                    <td>${contract.vendor || '-'}</td>
                    <td>${contract.status || '-'}</td>
                    <td>${contract.endDate ? new Date(contract.endDate).toLocaleDateString() : '-'}</td>
                    <td class="action-buttons">
                        <button class="action-button action-button--edit" data-contract="${contract.number}">Edit</button>
                        <button class="action-button action-button--delete" data-contract="${contract.number}">Delete</button>
                    </td>
                `;
                resultsBody.appendChild(row);
            });
        } else {
            statusElement.textContent = 'No matching contracts found';
            statusElement.classList.add('info');
        }

    } catch (error) {
        console.error('Contract search failed:', error);
        statusElement.textContent = `Error searching contracts: ${error.message}`;
        statusElement.classList.add('error');
    } finally {
        loadingElement.classList.remove('active');
    }
});

// Add contract form handler
document.getElementById('add-contract-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    try {
        const contractData = {
            number: document.getElementById('add-contract-number').value,
            name: document.getElementById('add-contract-name').value,
            vendor: document.getElementById('add-contract-vendor').value,
            reseller: document.getElementById('add-contract-reseller').value,
            sapResellerId: document.getElementById('add-sap-reseller-id').value,
            endUser: document.getElementById('add-contract-end-user').value,
            sapEndUserId: document.getElementById('add-sap-end-user-id').value,
            salesOrder: document.getElementById('add-contract-sales-order').value,
            status: document.getElementById('add-contract-status').value,
            startDate: document.getElementById('add-contract-start-date').value,
            endDate: document.getElementById('add-contract-end-date').value,
            dateRenewed: document.getElementById('add-date-renewed').value,
            dateAccuracy: document.getElementById('add-date-accuracy').value,
            priceUsd: parseFloat(document.getElementById('add-price-usd').value),
            vendorPriceUsd: parseFloat(document.getElementById('add-vendor-price-usd').value),
            backContractPo: document.getElementById('add-back-contract-po').value,
            webOrderId: document.getElementById('add-web-order-id').value,
            resellerCountry: document.getElementById('add-reseller-country').value,
            endUserCountry: document.getElementById('add-end-user-country').value,
            creationSource: document.getElementById('add-creation-source').value
        };

        const result = await ZendeskAPI.addContract(contractData);
        console.log('Contract added:', result);
        
        // Show success message and reset form
        const form = e.target;
        form.reset();
        showStatusMessage('Contract added successfully!', 'success');
        
    } catch (error) {
        console.error('Add contract failed:', error);
        showStatusMessage(`Error adding contract: ${error.message}`, 'error');
    }
});

// Update contract form handler
document.getElementById('update-contract-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    try {
        const contractData = {
            number: document.getElementById('update-contract-number').value,
            name: document.getElementById('update-contract-name').value,
            vendor: document.getElementById('update-contract-vendor').value,
            reseller: document.getElementById('update-contract-reseller').value,
            sapResellerId: document.getElementById('update-sap-reseller-id').value,
            endUser: document.getElementById('update-contract-end-user').value,
            sapEndUserId: document.getElementById('update-sap-end-user-id').value,
            salesOrder: document.getElementById('update-contract-sales-order').value,
            status: document.getElementById('update-contract-status').value,
            startDate: document.getElementById('update-contract-start-date').value,
            endDate: document.getElementById('update-contract-end-date').value,
            dateRenewed: document.getElementById('update-date-renewed').value,
            dateAccuracy: document.getElementById('update-date-accuracy').value,
            priceUsd: parseFloat(document.getElementById('update-price-usd').value),
            vendorPriceUsd: parseFloat(document.getElementById('update-vendor-price-usd').value),
            backContractPo: document.getElementById('update-back-contract-po').value,
            webOrderId: document.getElementById('update-web-order-id').value,
            resellerCountry: document.getElementById('update-reseller-country').value,
            endUserCountry: document.getElementById('update-end-user-country').value,
            creationSource: document.getElementById('update-creation-source').value
        };

        const result = await ZendeskAPI.updateContract(contractData);
        console.log('Contract updated:', result);
        showStatusMessage('Contract updated successfully!', 'success');
        
    } catch (error) {
        console.error('Update contract failed:', error);
        showStatusMessage(`Error updating contract: ${error.message}`, 'error');
    }
});

// Delete contract form handler
document.getElementById('delete-contract-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const contractNumber = document.getElementById('delete-contract-number').value.trim();
    const statusElement = document.getElementById('delete-contract-status');
    const loadingElement = document.getElementById('delete-contract-loading');
    
    if (!contractNumber) {
        statusElement.textContent = 'Please enter a contract number';
        statusElement.className = 'status-message error';
        return;
    }

    try {
        loadingElement.classList.add('active');
        statusElement.className = 'status-message';
        statusElement.textContent = '';
        
        await ZendeskAPI.deleteContract(contractNumber);
        
        // Clear the form and show success message
        this.reset();
        statusElement.textContent = 'Contract deleted successfully!';
        statusElement.classList.add('success');
        
        // Refresh search results if they're visible
        const searchForm = document.getElementById('contract-search-form');
        if (searchForm && document.getElementById('search-contracts').classList.contains('active')) {
            searchForm.dispatchEvent(new Event('submit'));
        }
        
    } catch (error) {
        console.error('Delete contract failed:', error);
        statusElement.textContent = `Error deleting contract: ${error.message}`;
        statusElement.classList.add('error');
    } finally {
        loadingElement.classList.remove('active');
    }
});

// Edit button functionality for contracts
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('action-button--edit')) {
        const row = e.target.closest('tr');
        const contractNumber = row.cells[0].textContent;
        const contractName = row.cells[1].textContent;
        
        // Activate update tab
        activateTab('update-contract', 'nav-contract-update');
        
        // Fill the form with contract data
        document.getElementById('update-contract-number').value = contractNumber;
        document.getElementById('update-contract-name').value = contractName;
        // Additional fields would be populated here based on API response
    }
});

// Delete button functionality for contracts
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('action-button--delete')) {
        const row = e.target.closest('tr');
        const contractNumber = row.cells[0].textContent;
        
        // Activate delete tab
        activateTab('delete-contract', 'nav-contract-delete');
        
        // Fill the form with contract number
        document.getElementById('delete-contract-number').value = contractNumber;
    }
});

function activateMainSection(sectionId, navId) {
    // Hide all main sections
    document.querySelectorAll('.main-section').forEach(function(section) {
        section.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Update main nav active state
    document.querySelectorAll('.main-nav a').forEach(function(navItem) {
        navItem.classList.remove('active');
    });
    
    document.getElementById(navId).classList.add('active');
}

function activateTab(sectionId, navId) {
    // Hide all sections within the current main section
    const mainSection = document.querySelector('.main-section.active');
    mainSection.querySelectorAll('.section').forEach(function(section) {
        section.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Update nav active state
    mainSection.querySelectorAll('.navbar a').forEach(function(navItem) {
        navItem.classList.remove('active');
    });
    
    document.getElementById(navId).classList.add('active');
}

function showStatusMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `status-message ${type}`;
    messageDiv.textContent = message;
    
    // Find the active section and insert the message at the top
    const activeSection = document.querySelector('.section.active');
    activeSection.insertBefore(messageDiv, activeSection.firstChild);
    
    // Remove the message after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Entitlements Navigation functionality
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
// Search form handler
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

        const result = await ZendeskAPI.searchEntitlements(searchParams);
        console.log('Search results:', result);

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
        if (result.custom_objects.length === 0) {
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
    
    try {
        const entitlementData = {
            entId: document.getElementById('add-ent-id').value,
            contractId: document.getElementById('add-contract-id').value,
            project: document.getElementById('add-project').value,
            astNumber: document.getElementById('add-ast').value,
            snMac: document.getElementById('add-sn-mac').value,
            entitlementData: document.getElementById('add-entitlement-data').value,
            entitlementType: document.getElementById('add-entitlement-type').value,
            reseller: document.getElementById('add-reseller').value,
            endUser: document.getElementById('add-end-user').value,
            salesOrder: document.getElementById('add-sales-order').value,
            currentPeriod: document.getElementById('add-current-period').value,
            startDate: document.getElementById('add-start-date').value,
            expirationDate: document.getElementById('add-expiration-date').value,
            vendor: document.getElementById('add-vendor').value,
            productSku: document.getElementById('add-product-sku').value,
            installationDate: document.getElementById('add-installation-date').value,
            endOfLifeDate: document.getElementById('add-eol-date').value,
            endOfServiceDate: document.getElementById('add-eos-date').value,
            productSkuReplacedBy: document.getElementById('add-sku-replaced').value,
            serialNumber: document.getElementById('add-serial-number').value,
            quoteRef: document.getElementById('add-quote-ref').value,
            svo: document.getElementById('add-svo').value,
            internalPo: document.getElementById('add-internal-po').value
        };

        const result = await ZendeskAPI.addEntitlement(entitlementData);
        console.log('Entitlement added:', result);
        showStatusMessage('Entitlement added successfully!', 'success');
        this.reset();
        
    } catch (error) {
        console.error('Add entitlement failed:', error);
        showStatusMessage(`Error adding entitlement: ${error.message}`, 'error');
    }
});

// Update entitlement form handler
document.querySelector('#update-entitlement form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    try {
        const updateData = {
            id: document.getElementById('update-ent-id').value,
            entId: document.getElementById('update-ent-id').value,
            contractId: document.getElementById('update-contract-id').value,
            project: document.getElementById('update-project').value,
            astNumber: document.getElementById('update-ast').value,
            snMac: document.getElementById('update-sn-mac').value,
            entitlementData: document.getElementById('update-entitlement-data').value,
            entitlementType: document.getElementById('update-entitlement-type').value,
            reseller: document.getElementById('update-reseller').value,
            endUser: document.getElementById('update-end-user').value,
            salesOrder: document.getElementById('update-sales-order').value,
            currentPeriod: document.getElementById('update-current-period').value,
            startDate: document.getElementById('update-start-date').value,
            expirationDate: document.getElementById('update-expiration-date').value,
            vendor: document.getElementById('update-vendor').value,
            productSku: document.getElementById('update-product-sku').value,
            installationDate: document.getElementById('update-installation-date').value,
            endOfLifeDate: document.getElementById('update-eol-date').value,
            endOfServiceDate: document.getElementById('update-eos-date').value,
            productSkuReplacedBy: document.getElementById('update-sku-replaced').value,
            serialNumber: document.getElementById('update-serial-number').value,
            quoteRef: document.getElementById('update-quote-ref').value,
            svo: document.getElementById('update-svo').value,
            internalPo: document.getElementById('update-internal-po').value
        };

        const result = await ZendeskAPI.updateEntitlement(updateData);
        console.log('Entitlement updated:', result);
        showStatusMessage('Entitlement updated successfully!', 'success');
        
    } catch (error) {
        console.error('Update entitlement failed:', error);
        showStatusMessage(`Error updating entitlement: ${error.message}`, 'error');
    }
});

// Delete entitlement form handler
document.querySelector('#delete-entitlement form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const id = document.getElementById('delete-entitlement-id').value;
    
    try {
        const result = await ZendeskAPI.deleteEntitlement(id);
        console.log('Delete result:', result);
        // Add success handling here
    } catch (error) {
        console.error('Delete failed:', error);
        // Add error handling here
    }
});

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