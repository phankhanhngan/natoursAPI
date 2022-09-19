module.exports = class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  };

  filter() {
    const queryObj = {... this.queryString};
    const excludedField = ['page','sort','limit','fields'];
    excludedField.forEach(el => delete queryObj[el]);

    //1B) advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g,
      match => `$${match}`);
    this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if(this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query.sort(sortBy);
    } else {
      this.query.sort('-createdAt _id');
    }
    return this;
  }

  limitFields() {
    if(this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query.select(fields);
    } else {
      //select everything accept from __v
      this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page-1)*limit;
    // page=2&limit=10 => page1: 1-10, page2: 11-20, ...
    this.query.skip(skip).limit(limit);
    return this;
  }

}