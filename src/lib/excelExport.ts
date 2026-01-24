import * as XLSX from 'xlsx';
import { Registration } from './registrationService';

/**
 * Export registrations to Excel file
 */
export function exportRegistrationsToExcel(registrations: Registration[], filename: string = 'registrations.xlsx') {
    // Sort registrations: approved first, then rejected, then pending
    const sortedRegistrations = [...registrations].sort((a, b) => {
        const statusOrder = { 'approved': 1, 'rejected': 2, 'pending': 3 };
        return statusOrder[a.status] - statusOrder[b.status];
    });

    // Prepare data for Excel
    const excelData = sortedRegistrations.map((reg, index) => {
        // Base team data
        const baseData = {
            'Sr. No.': index + 1,
            'Team Name': reg.teamName,
            'Status': reg.status.toUpperCase(),
        };

        // Add team members data
        const membersData: any = {};
        reg.members.forEach((member, idx) => {
            membersData[`Member ${idx + 1} Name`] = member.name;
            membersData[`Member ${idx + 1} Email`] = member.email;
            membersData[`Member ${idx + 1} Phone`] = member.phone;
        });

        return {
            ...baseData,
            ...membersData,
        };
    });

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    const columnWidths = [
        { wch: 8 },  // Sr. No.
        { wch: 25 }, // Team Name
        { wch: 12 }, // Status
        { wch: 25 }, // Member 1 Name
        { wch: 30 }, // Member 1 Email
        { wch: 15 }, // Member 1 Phone
        { wch: 25 }, // Member 2 Name
        { wch: 30 }, // Member 2 Email
        { wch: 15 }, // Member 2 Phone
        { wch: 25 }, // Member 3 Name
        { wch: 30 }, // Member 3 Email
        { wch: 15 }, // Member 3 Phone
    ];
    worksheet['!cols'] = columnWidths;

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, filename);
}

/**
 * Export filtered registrations based on status
 */
export function exportFilteredRegistrations(
    registrations: Registration[],
    status: 'all' | 'pending' | 'approved' | 'rejected'
) {
    const filtered = status === 'all'
        ? registrations
        : registrations.filter(reg => reg.status === status);

    const filename = status === 'all'
        ? 'all_registrations.xlsx'
        : `${status}_registrations.xlsx`;

    exportRegistrationsToExcel(filtered, filename);
}
