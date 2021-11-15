import { startWith } from 'rxjs/operators';
export interface Appointment {
    start: string,
    end: string,
    patient:{first_name:string, last_name:string}
}
