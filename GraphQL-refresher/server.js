const express = require("express");
const app = express();

const { artists, albums } = require("./pseudoDataBase");

const expressGraphQL = require("express-graphql");
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
} = require("graphql");

const AlbumType = new GraphQLObjectType({
  name: "Album",
  description: "This represents an album composed by an artist",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    artistId: { type: GraphQLNonNull(GraphQLInt) },
    artist: {
      type: ArtistType,
      resolve: (album) => {
        return artists.find((artist) => artist.id === album.artistId);
      },
    },
  }),
});

const ArtistType = new GraphQLObjectType({
  name: "Artist",
  description: "This represents an album's composer.",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    albums: {
      type: new GraphQLList(ArtistType),
      resolve: (artist) => {
        return albums.filter((album) => album.artistId === artist.id);
      },
    },
  }),
});

const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    album: {
      type: AlbumType,
      description: "Return a single album.",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) => albums.find((album) => album.id === args.id),
    },
    albums: {
      type: new GraphQLList(AlbumType),
      description: "List of Great Listens.",
      resolve: () => albums,
    },
    artist: {
      type: ArtistType,
      description: "Return a single band.",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) =>
        artists.find((artist) => artist.id === args.id),
    },
    artists: {
      type: new GraphQLList(ArtistType),
      description: "Some of Greg's favorite bands.",
      resolve: () => artists,
    },
  }),
});

const RootMuationType = new GraphQLObjectType({
  name: "Mutation",
  description: "Root Mutation",
  fields: () => ({
    addAlbum: {
      type: AlbumType,
      description: "Add an Album",
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        artistId: { type: GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        const album = {
          id: albums.length + 1,
          name: args.name,
          artistId: args.artistId,
        };
        albums.push(album);
        return album;
      },
    },
    addArtist: {
      type: ArtistType,
      description: "Add a band/musician.",
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args) => {
        const artist = {
          id: artists.length + 1,
          name: args.name,
        };
        artists.push(artist);
        return artist;
      },
    },
  }),
});

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMuationType,
});

app.use(
  "/graphql",
  expressGraphQL({
    schema: schema,
    graphiql: true,
  })
);

app.listen(5000, () => {
  console.log("Port 5000");
});
