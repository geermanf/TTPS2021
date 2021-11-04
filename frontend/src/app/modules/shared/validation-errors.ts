export class ValidationErrors {
    public getValidText(controlName: string): string {
        return controlName + " es correcto.";
    }

    public getRequiredText(controlName: string): string {
        return "El " + controlName + " es requerido";
    }

    public getRequiredTextWithLa(controlName: string): string {
        return "La " + controlName + " es requerida";
    }

    public getMinlengthText(controlName: string, minLength: number): string {
        return "El " + controlName + " debe contener al menos " + minLength + " caracteres." ;
    }

    public getMaxlengthText(controlName: string, maxLength: number): string {
        return "El " + controlName + " debe contener como máximo " + maxLength + " caracteres." ;
    }

    public getEmailText(controlName: string): string {
        return "El formato de " + controlName + " es incorrecto." ;
    }
}
