class ProductFilter {
  //! query tüm ürünler
  //! query string ise tüm parametreler
  constructor(query, querystr) {
    this.query = query;
    this.querystr = querystr;
  }

  //!querystr={limit,page,keyword,price}

  //! search yaparken keywordeleri dikkte alacağız

  search() {
    //! keyword varsa
    const keyword = this.querystr.keyword
      ? {
          name: {
            $regex: this.querystr.keyword,
            $options: "i",
          },
        }
      : {};

    //! keyworde göre bul diyoruz
    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    //! tüm querystringi aldık
    const queryCopy = { ...this.querystr };

    //! keyword olmayacak
    //!limit olmayacak
    //! page olmayacak
    //! bunun için  delete area ile bu nesneleri siliyoruz
    //! biz filtrelerken kategoriyi fiyatı baz alacağız çünkü

    const deleteArea = ["keyword", "page", "limit"];
    deleteArea.forEach((item) => {
      //! belirtilen itemleri dolaşarak siliyoruz
      delete queryCopy[item];
    });

    const queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  //! sayfa bazında görmek istediğim ürün sayısı
  pagination(resultPerPage) {
    const activePage = this.querystr.page || 1; //! bulunduğu sayfa null ise 1 olacak
    const skip = resultPerPage * (activePage - 1);
    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;
  }
}

module.exports = ProductFilter;
