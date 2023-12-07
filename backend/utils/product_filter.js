class ProductFilter {
<<<<<<< HEAD
  //! query tüm ürünler
  //! query string ise tüm parametreler
=======
>>>>>>> 7ed2936cd95e8db3835ec98848a897673cc3efd3
  constructor(query, querystr) {
    this.query = query;
    this.querystr = querystr;
  }

<<<<<<< HEAD
  //!querystr={limit,page,keyword,price}

  //! search yaparken keywordeleri dikkte alacağız

  search() {
    //! keyword varsa
=======
  //querystr={limit,page,keyword,price}
  search() {
>>>>>>> 7ed2936cd95e8db3835ec98848a897673cc3efd3
    const keyword = this.querystr.keyword
      ? {
          name: {
            $regex: this.querystr.keyword,
            $options: "i",
          },
        }
      : {};

<<<<<<< HEAD
    //! keyworde göre bul diyoruz
=======
>>>>>>> 7ed2936cd95e8db3835ec98848a897673cc3efd3
    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
<<<<<<< HEAD
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
=======
    const queryCopy = { ...this.querystr };
    const deleteArea = ["keyword", "page", "limit"];
    deleteArea.forEach((item) => {
>>>>>>> 7ed2936cd95e8db3835ec98848a897673cc3efd3
      delete queryCopy[item];
    });

    const queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }
<<<<<<< HEAD

  //! sayfa bazında görmek istediğim ürün sayısı
  pagination(resultPerPage) {
    const activePage = this.querystr.page || 1; //! bulunduğu sayfa null ise 1 olacak
=======
  pagination(resultPerPage) {
    const activePage = this.querystr.page || 1;
>>>>>>> 7ed2936cd95e8db3835ec98848a897673cc3efd3
    const skip = resultPerPage * (activePage - 1);
    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;
  }
}

module.exports = ProductFilter;
