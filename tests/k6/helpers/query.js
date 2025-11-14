export class QueryBuilder {
  constructor() {
    this.parts = [];
  }

  add(key, value) {
    if (value === undefined || value === null || value === '') {
      return this;
    }

    this.parts.push([key, value]);
    return this;
  }

  addMany(key, values = []) {
    values.forEach((value) => this.add(key, value));
    return this;
  }

  toString() {
    return this.parts
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
      .join('&');
  }
}
