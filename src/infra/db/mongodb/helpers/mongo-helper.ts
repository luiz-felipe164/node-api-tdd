import { Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
  client: MongoClient,
  async connect (uri: string): Promise<void> {
    this.client = await MongoClient.connect(uri)
  },
  async disconnect (): Promise<void> {
    await this.client.close()
  },
  getColletion (name: string): Collection {
    return this.client.db().collection(name)
  }
}