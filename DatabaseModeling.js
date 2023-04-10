interface User {
    name: string;
    registration: string;
    password: string;
    role: string;
}

interface ClassCheckIn {
    code: string;
    professor: {
        name: string;
        registration: string;
    };
    students: Set<{
        name: string;
        registration: string;
    }>;
    class: {
        code: string;
        name: string;
    };
    reapetingDays: {
        monday: boolean;
        tuesday: boolean;
        wednesday: boolean;
        thursday: boolean;
        friday: boolean;
        saturday: boolean;
        sunday: boolean;
    };
    holidaysOrDaysOff: Set<{
        name: string;
        date: Date;
    }>;
    semester: {
        name: string;
        startAt: Date('MM/DD/YYYY HH:mm:ss');
        endAt: DateFormat('MM/DD/YYYY HH:mm:ss');
    };
    time: {
        startAt: DateFormat('MM/DD/YYYY HH:mm:ss');
        endAt: DateFormat('MM/DD/YYYY HH:mm:ss');
    };
};

interface HistoryCheckIn {
    student: {
        name: string;
        registration: string;
    };
    semester: {
        name: string;
    };
    CheckIn: Set<{
        class: {
            code: string;
            name: string;
        };
        date: DateFormat('MM/DD/YYYY HH:mm:ss');
    }>;
}





