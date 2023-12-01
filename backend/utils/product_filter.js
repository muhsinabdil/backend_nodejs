class ProductFilter {
  constructor(query, querystr) {
    this.query = query;
    this.querystr = querystr;
  }

  //querystr={limit,page,keyword,price}
  search() {
    const keyword = this.querystr.keyword
      ? {
          name: {
            $regex: this.querystr.keyword,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    const queryCopy = { ...this.querystr };
    const deleteArea = ["keyword", "page", "limit"];
    deleteArea.forEach((item) => {
      delete queryCopy[item];
    });

    const queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }
  pagination(resultPerPage) {
    const activePage = this.querystr.page || 1;
    const skip = resultPerPage * (activePage - 1);
    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;
  }
}

module.exports = ProductFilter;
