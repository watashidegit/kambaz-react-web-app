export type AssignmentType = {
    _id: string;
    title: string;
    description?: string;
    points: number;
    assignmentGroup: string;
    displayGrade: string;
    submissionType: string;
    assignTo: string;
    dueDate?: string;
    availableFromDate?: string;
    availableUntilDate?: string;
    course: string;
};