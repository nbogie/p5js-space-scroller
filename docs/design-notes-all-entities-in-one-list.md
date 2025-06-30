## Design notes on "all into one entity list"

additionally, entities will have to declare:
_ their z-index
_ what they collide with
_ what they can collide with
_ their draw function
_ their update function
_ their collision function

a common entity interface should include:
_ position
_ velocity
_ a z-index
_ a draw function
_ an update function
_ a collision function
_ a tag (entity name)
_ colour on minimap

We may also maintain a collision matrix to speed up collision detection.
