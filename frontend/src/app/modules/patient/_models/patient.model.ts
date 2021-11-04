import { BaseModel } from '../../../_metronic/shared/crud-table';

export class Patient implements BaseModel {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  email: string;
  dni: string;
  birth_date: any;
  health_insurance_number: number;
  clinical_history: string;
  password: string;

  public static getEmpty():Patient {
    return new Patient();
  }

  public prepare(formData: any): Patient {
    this.username = formData.username;
    this.first_name = formData.first_name;
    this.last_name = formData.last_name;
    this.email = formData.email
    this.dni = formData.dni;
    this.birth_date = formData.birth_date.year + "-" + formData.birth_date.month + "-" + formData.birth_date.day;
    this.health_insurance_number = formData.health_insurance_number !== null && formData.health_insurance_number !== undefined && formData.health_insurance_number !== "" ? formData.health_insurance_number : 0;
    this.clinical_history = formData.clinical_history !== null && formData.clinical_history !== undefined ? formData.clinical_history : "";
    this.password = "asd";

    return this;
  }
}
