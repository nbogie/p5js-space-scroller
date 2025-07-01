## Design notes on "all into one entity list"

additionally, entities will have to declare:

- their z-index
- what they collide with
- what they can collide with
- their draw function
- their update function
- their collision function

a common entity interface should include:

- position
- velocity
- a z-index
- a draw function
- an update function
- a collision function
- a tag (entity name)

We may also maintain a collision matrix to speed up collision detection.

### questions

stuff to perhaps leave out from general entity interface:

- colour on minimap (support for mapping would be for another interface that some entities could choose to adhere to)
- ???
