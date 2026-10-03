import Ajv from 'ajv';

export class SchemaValidator {
  /**
   * Validates a payload against a JSON schema.
   * @param schema - The JSON schema object to validate against
   * @param data - The API response payload to validate
   * @returns Promise<boolean> - true when the payload matches the schema, false otherwise
   */
  static validateSchema(schema: object, data: unknown): boolean {
    const ajv = new Ajv({ allErrors: true, strict: false });
    const validate = ajv.compile(schema);
    const isValid = validate(data);

    if (!isValid) {
      console.log('Schema validation errors:', JSON.stringify(validate.errors, null, 2));
    }

    return isValid;
  }
}
