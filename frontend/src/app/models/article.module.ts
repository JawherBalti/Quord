export interface Article {
    _id: string,
    title: string, 
    authorId: {
        _id: string,
        name: string,
        lastName: string,
        image: string
    },
    description: string,
    date: Date,
    content: string,
    image: string,
    tags: string[]
    likes?: {
            _id: string,
            name: string,
            lastName: string,
            image: string
    }[],
    dislikes?: {
            _id: string,
            name: string,
            lastName: string,
            image: string
    }[],

}