import * as XLSX from 'xlsx';
import { Registration } from './registrationService';

/**
 * Export field configuration interface
 */
export interface ExportFields {
    serialNumber: boolean;
    teamName: boolean;
    status: boolean;
    teamEmail: boolean;
    reference: boolean;
    registrationDate: boolean;
    memberNames: boolean;
    memberEmails: boolean;
    memberPhones: boolean;
}

/**
 * Default export fields - all enabled
 */
export const defaultExportFields: ExportFields = {
    serialNumber: true,
    teamName: true,
    status: true,
    teamEmail: true,
    reference: true,
    registrationDate: true,
    memberNames: true,
    memberEmails: true,
    memberPhones: true,
};

/**
 * Export registrations to Excel file with configurable fields
 */
export function exportRegistrationsToExcel(
    registrations: Registration[],
    filename: string = 'registrations.xlsx',
    fields: ExportFields = defaultExportFields
) {
    // Sort registrations: approved first, then rejected, then pending, unknown last
    const sortedRegistrations = [...registrations].sort((a, b) => {
        const statusOrder: Record<string, number> = { 'approved': 1, 'rejected': 2, 'pending': 3 };
        const aOrder = statusOrder[a.status] ?? 999;
        const bOrder = statusOrder[b.status] ?? 999;

        if (aOrder !== bOrder) {
            return aOrder - bOrder;
        }

        return b.timestamp.toMillis() - a.timestamp.toMillis();
    });

    // Prepare data for Excel based on selected fields
    const excelData = sortedRegistrations.map((reg, index) => {
        const rowData: Record<string, any> = {};

        // Add base fields based on selection
        if (fields.serialNumber) {
            rowData['Sr. No.'] = index + 1;
        }
        if (fields.teamName) {
            rowData['Team Name'] = reg.teamName;
        }
        if (fields.status) {
            rowData['Status'] = reg.status.toUpperCase();
        }
        if (fields.teamEmail) {
            rowData['Team Email'] = reg.userEmail;
        }
        if (fields.reference) {
            rowData['Reference'] = reg.reference || '';
        }
        if (fields.registrationDate) {
            rowData['Registration Date'] = reg.timestamp.toDate().toLocaleDateString();
        }

        // Add team members data based on selection
        reg.members.forEach((member, idx) => {
            if (fields.memberNames) {
                rowData[`Member ${idx + 1} Name`] = member.name;
            }
            if (fields.memberEmails) {
                rowData[`Member ${idx + 1} Email`] = member.email;
            }
            if (fields.memberPhones) {
                rowData[`Member ${idx + 1} Phone`] = member.phone;
            }
        });

        return rowData;
    });

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Set dynamic column widths based on selected fields
    const columnWidths: { wch: number }[] = [];
    if (fields.serialNumber) columnWidths.push({ wch: 8 });
    if (fields.teamName) columnWidths.push({ wch: 25 });
    if (fields.status) columnWidths.push({ wch: 12 });
    if (fields.teamEmail) columnWidths.push({ wch: 30 });
    if (fields.reference) columnWidths.push({ wch: 25 });
    if (fields.registrationDate) columnWidths.push({ wch: 15 });

    // Add widths for member fields (assuming max 3 members)
    for (let i = 0; i < 3; i++) {
        if (fields.memberNames) columnWidths.push({ wch: 25 });
        if (fields.memberEmails) columnWidths.push({ wch: 30 });
        if (fields.memberPhones) columnWidths.push({ wch: 15 });
    }

    worksheet['!cols'] = columnWidths;

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, filename);
}

/**
 * Export filtered registrations based on status with configurable fields
 */
export function exportFilteredRegistrations(
    registrations: Registration[],
    status: 'all' | 'pending' | 'approved' | 'rejected',
    fields: ExportFields = defaultExportFields
) {
    const filtered = status === 'all'
        ? registrations
        : registrations.filter(reg => reg.status === status);

    const filename = status === 'all'
        ? 'all_registrations.xlsx'
        : `${status}_registrations.xlsx`;

    exportRegistrationsToExcel(filtered, filename, fields);
}
