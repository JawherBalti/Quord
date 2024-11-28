export interface Author {
    _id: string,
    name: string, 
    lastName: string,
    email: string,
    password: string,
    image: string,
    about: string
}

export interface AuthorFromToken {
    _id: string,
    name: string,
    lastName: string,
    email: string,
    image: string,
    iat: number,
  }