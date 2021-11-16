import { BaseModel } from '../../../_metronic/shared/crud-table';

export class ReferringPhysician implements BaseModel {
  id: number;
  first_name: string;
  last_name: string;
  license: number;
  is_active: boolean;
  email: string;
  phone: string;

  public static getEmpty():ReferringPhysician {
    return new ReferringPhysician();
  }

  public prepare(formData: any): ReferringPhysician {
    this.first_name = formData.first_name;
    this.last_name = formData.last_name;
    this.email = formData.email
    this.license = formData.license;
    this.phone = formData.phone;
    return this;
  }
}
