export class ExampleEntity {
  id: string;
  name: string;
  createdAt: Date;

  constructor(props: { id: string; name: string; createdAt: Date }) {
    this.id = props.id;
    this.name = props.name;
    this.createdAt = props.createdAt;
  }
}
