# Fujitsu Onboarding Ticket Tracker

This Zendesk app displays tickets tagged with "fujitsu_onboarding" in the navigation bar of your Zendesk Support instance. The app shows ticket numbers, requester information, and fields from a specified ticket form.

## Features

- Displays tickets tagged with "fujitsu_onboarding"
- Shows ticket number, subject, and direct link to the ticket
- Includes requester name and email information
- Shows ticket status and timestamps
- Displays fields from a specified ticket form for each ticket
- Configurable number of tickets to display
- Refresh button to update the ticket list
- Responsive design for the Zendesk interface

## Installation Instructions

1. Download the ZIP file containing the app
2. In your Zendesk Support instance, go to **Admin** > **Apps** > **Manage**
3. Click **Upload private app**
4. Upload the ZIP file
5. Review the app settings and click **Install**

## Configuration

After installation, you need to configure the app:

1. Go to **Admin** > **Apps** > **Manage**
2. Find the Fujitsu Onboarding Tracker app and click **Change settings**
3. Enter the **Form ID** of the ticket form whose fields you want to display
   - You can find the Form ID in the URL when editing a form in Zendesk
   - For example, in the URL `https://yourdomain.zendesk.com/agent/admin/ticket_forms/123456/edit`, the Form ID is `123456`
4. (Optional) Set the maximum number of tickets to display
5. Click **Update**

## App Structure

The app is organized into separate files for better maintainability:

```
fujitsu-onboarding-tracker/
├── manifest.json   - App configuration
├── README.md       - Documentation
└── assets/
    ├── index.html  - Basic HTML structure
    ├── styles.css  - All CSS styles
    └── main.js     - All JavaScript functionality
```

## How It Works

The app performs the following operations:

1. Searches for all tickets with the "fujitsu_onboarding" tag
2. Loads field definitions from the specified form
3. Displays the results in a clean, formatted list
4. Allows clicking on ticket numbers to navigate directly to the ticket

## Customization

To customize the app:
- Modify `styles.css` to change the appearance
- Update `main.js` to change functionality
- Edit `index.html` if you need to change the basic structure

## Troubleshooting

If you encounter issues:

- Ensure your Zendesk account has API access
- Check that you have tickets with the "fujitsu_onboarding" tag
- Verify that the Form ID in the configuration is correct
- Check browser console for any JavaScript errors

## Development Roadmap

- Move "fujitsu_onboarding" to the app settings page
- Add checkboxes to each card
- Add "Export to Excel" button to loop through checked items and export them to an individual tab inside a blank spreadsheet
- Possbly rename the field names to reference the cells in the spreadsheet? Something like "fj_b2_what product and version?" Then we don't have to maintain a separate list of where everything goes.

## Support

For questions or support, please contact stewart.dean@tdsynnex.com or prakash.upreti@tdsynnex.com.
