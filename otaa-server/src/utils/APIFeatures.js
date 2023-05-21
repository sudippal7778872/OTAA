class APIFeatures {
    constructor(query, queryString) {
      this.query = query;
      this.queryString = queryString;
    }
  
    filter() {
      const queryObj = { ...this.queryString };
      const excludeFilter = ["page", "fields", "limit", "sort"];
      excludeFilter.forEach((element) => delete queryObj[element]);
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(lt|lte|gt|gte)\b/g, (match) => `$${match}`);
      this.query = this.query.find(JSON.parse(queryStr));
      return this;
    }
  
    sort() {
      if (this.queryString.sort) {
        const sortBy = this.queryString.sort.split(",").join(" ");
        this.query = this.query.sort(sortBy);
      } else {
        //by default we are setting the newestone
        this.query = this.query.sort("-createAt");
      }
      return this;
    }
  
    fieldsLimit() {
      if (this.queryString.fields) {
        const selectedFields = this.queryString.fields.split(",").join(" ");
        this.query = this.query.select(selectedFields);
      } else {
        this.query = this.query.select("-__v"); //exclude __v field
      }
      return this;
    }
  
    pagination() {
      let page = this.queryString.page * 1 || 1;
      let limit = this.queryString.limit * 1 || 5;
      let skip = (page - 1) * limit;
      if (this.queryString.page) {
        this.query = this.query.skip(skip).limit(limit);
      } else {
        this.query = this.query.skip(0).limit(5);
      }
      return this;
    }
  }

  module.exports = APIFeatures;