import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { AbstractDocument } from './abstract.schema';
import { Logger, NotFoundException } from '@nestjs/common';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger;

  constructor(protected readonly model: Model<TDocument>) {}

  async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
    const newDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    return (await newDocument.save()).toJSON() as TDocument;
  }

  async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
    const document = await this.model
      .findOne(filterQuery)
      .lean<TDocument>(true);

    if (!document) {
      this.logger.warn(
        'document not found with this filter query:',
        filterQuery,
      );
      throw new NotFoundException('Document not found.');
    }

    return document;
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ): Promise<TDocument> {
    const document = await this.model
      .findOneAndUpdate(filterQuery, update, {
        new: true,
      })
      .lean<TDocument>(true);

    if (!document) {
      this.logger.warn(
        'document not found with this filter query:',
        filterQuery,
      );
      throw new NotFoundException('Document not found.');
    }

    return document;
  }

  find(filterQuery: FilterQuery<TDocument>): Promise<TDocument[]> {
    return this.model.find(filterQuery).lean<TDocument[]>(true);
  }

  findOneAndDelete(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
    return this.model.findOneAndDelete(filterQuery).lean<TDocument>(true);
  }
}
