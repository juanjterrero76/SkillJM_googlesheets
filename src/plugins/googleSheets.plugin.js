import { googleSheetsClient } from "./googleSheetsClient.plugin.js";

export const googleSheets = {
    /**
     * Get cell values
     * https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/get?hl=es-419
     * @param {string} spreadsheetId Google Spreedsheet ID
     * @param {string} range Range
     * @returns {Array}
     */
    read: async (spreadsheetId, range) => {
        try {
            const result = await googleSheetsClient.spreadsheets.values.get({
                spreadsheetId,
                range,
            });
            
            return result.data.values ? result.data.values : [];
        } catch (err) {
            // TODO (developer) - Handle exception
            throw err;
        }
    },
    /**
     * Write data to cells
     * https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/update?hl=es-419
     * @param {string} spreadsheetId Google Spreedsheet ID
     * @param {string} range Range
     * @param {Array} values Data to insert
     * @param {string} valueInputOption Input options
     */
    write: async(spreadsheetId, range, values, valueInputOption) => {

        const resource = {
            values,
        };

        try {
            const result = await googleSheetsClient.spreadsheets.values.update({
                spreadsheetId,
                range,
                valueInputOption,
                resource,
            });

            return result;
        } catch (err) {
            throw err;
        }
    }
}