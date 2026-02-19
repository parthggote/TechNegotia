import * as XLSX from 'xlsx';
import { Registration } from './registrationService';
import { ProblemStatement } from './questService';

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
    problemStatement: boolean;
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
    problemStatement: true,
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

/**
 * Export registrations with problem statement data
 */
export function exportRegistrationsWithQuests(
    registrations: Registration[],
    quests: ProblemStatement[],
    status: 'all' | 'pending' | 'approved' | 'rejected',
    fields: ExportFields = defaultExportFields
) {
    // Build userId -> quest title lookup
    const userQuestMap: Record<string, string> = {};
    for (const quest of quests) {
        for (const sel of quest.selectedBy || []) {
            userQuestMap[sel.userId] = quest.title;
        }
    }

    // Inject problem statement into each registration temporarily for export
    const enriched = registrations.map(reg => ({
        ...reg,
        _questTitle: userQuestMap[reg.userId] || '',
    }));

    const filtered = status === 'all'
        ? enriched
        : enriched.filter(reg => reg.status === status);

    // Sort
    const sorted = [...filtered].sort((a, b) => {
        const statusOrder: Record<string, number> = { 'approved': 1, 'rejected': 2, 'pending': 3 };
        return (statusOrder[a.status] ?? 999) - (statusOrder[b.status] ?? 999)
            || b.timestamp.toMillis() - a.timestamp.toMillis();
    });

    const excelData = sorted.map((reg, index) => {
        const rowData: Record<string, any> = {};
        if (fields.serialNumber) rowData['Sr. No.'] = index + 1;
        if (fields.teamName) rowData['Team Name'] = reg.teamName;
        if (fields.status) rowData['Status'] = reg.status.toUpperCase();
        if (fields.teamEmail) rowData['Team Email'] = reg.userEmail;
        if (fields.problemStatement) rowData['Problem Statement'] = reg._questTitle || 'Not Selected';
        if (fields.reference) rowData['Reference'] = reg.reference || '';
        if (fields.registrationDate) rowData['Registration Date'] = reg.timestamp.toDate().toLocaleDateString();
        reg.members.forEach((member, idx) => {
            if (fields.memberNames) rowData[`Member ${idx + 1} Name`] = member.name;
            if (fields.memberEmails) rowData[`Member ${idx + 1} Email`] = member.email;
            if (fields.memberPhones) rowData[`Member ${idx + 1} Phone`] = member.phone;
        });
        return rowData;
    });

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Registrations');

    const filename = status === 'all' ? 'registrations_with_quests.xlsx' : `${status}_registrations_with_quests.xlsx`;
    XLSX.writeFile(wb, filename);
}

/**
 * Export quest/problem statement data to Excel
 */
export function exportQuestsToExcel(quests: ProblemStatement[]) {
    const excelData = quests.map((quest, index) => {
        const row: Record<string, any> = {
            'Sr. No.': index + 1,
            'Title': quest.title,
            'Description': quest.description,
            'Max Teams': quest.maxTeams,
            'Selected': quest.selectedBy?.length || 0,
            'Remaining': quest.maxTeams - (quest.selectedBy?.length || 0),
        };

        // Add team names
        (quest.selectedBy || []).forEach((sel, idx) => {
            row[`Team ${idx + 1}`] = sel.teamName;
            row[`Team ${idx + 1} Email`] = sel.userEmail;
        });

        return row;
    });

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Problem Statements');
    XLSX.writeFile(wb, 'problem_statements.xlsx');
}
