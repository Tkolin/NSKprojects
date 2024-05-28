export default function copyTableDataToClipboard(tableData) {
    const convertToCSV = (data) => {
        const headers = Object.keys(data);
        const rows = [];

        // Get the maximum number of rows needed based on the longest array value
        const maxRows = Math.max(...headers.map(header => Array.isArray(data[header].value) ? data[header].value.length : 1));

        // Create headers row
        const headerRow = headers.map(header => data[header].name ?? header).join('\t');
        rows.push(headerRow);

        // Create rows for each entry in the table data
        for (let i = 0; i < maxRows; i++) {
            const row = headers.map(header => {
                const cell = data[header].value;
                return Array.isArray(cell) ? cell[i] ?? '' : cell;
            });
            rows.push(row.join('\t'));
        }

        return rows.join('\n');
    };

    const csv = convertToCSV(tableData);
    navigator.clipboard.writeText(csv)
        .then(() => console.log('Tab-separated table copied to clipboard'))
        .catch(err => console.error('Failed to copy tab-separated table to clipboard', err));
}
