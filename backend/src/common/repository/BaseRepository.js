export class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    return await this.model.create(data);
  }

  async findById(id, select = null, populate = null) {
    let query = this.model.findById(id);
    if (select) query = query.select(select);
    if (populate) query = query.populate(populate);
    return await query.exec();
  }

  async findOne(filter = {}, select = null, populate = null) {
    let query = this.model.findOne({ deletedAt: null, ...filter });
    if (select) query = query.select(select);
    if (populate) query = query.populate(populate);
    return await query.exec();
  }

  async find(filter = {}, options = {}) {
    const { select, populate, sort = { createdAt: -1 }, limit, skip } = options;
    let query = this.model.find({ deletedAt: null, ...filter });
    if (select) query = query.select(select);
    if (populate) query = query.populate(populate);
    if (sort) query = query.sort(sort);
    if (skip) query = query.skip(skip);
    if (limit) query = query.limit(limit);
    return await query.exec();
  }

  async updateById(id, updateData, options = { new: true, runValidators: true }) {
    return await this.model.findByIdAndUpdate(id, updateData, options).exec();
  }

  async softDelete(id) {
    return await this.model.findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true }).exec();
  }

  async hardDelete(id) {
    return await this.model.findByIdAndDelete(id).exec();
  }

  async count(filter = {}) {
    return await this.model.countDocuments({ deletedAt: null, ...filter }).exec();
  }
}
