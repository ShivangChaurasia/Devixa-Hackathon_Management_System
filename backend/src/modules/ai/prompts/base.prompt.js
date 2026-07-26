export class BasePrompt {
  constructor(name, version, description) {
    this.name = name;
    this.version = version;
    this.description = description;
  }

  getSystemPrompt() {
    throw new Error('Method getSystemPrompt() must be implemented');
  }

  buildUserPrompt(data) {
    throw new Error('Method buildUserPrompt() must be implemented');
  }
}
