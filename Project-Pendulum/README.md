# Team member names and UIDs
- Erdi Haciogullari (705101745)
- John Steenstra (505012321)
- Godfried Boateng (405109333)

# A short introduction of your design and implementation
Newton's Cradle is a famous executive toy which exhibits mesmerizing properties of Newtonian physics; its popularity can be traced back to the English actor Simon Prebble, who manufactured these toys in the 60s. As such, we wanted to recreate what we thought Mr. Prebble's room might have looked like, with the Newton's Cradle being the focal centerpiece. 

To create a setting that matched the time period, we included other vintage objects to complement the Newton's cradle, such as a vinyl record player, *Scream* -- one of Edvard Munch's famous paintings, a rotating magnetic earth, a (broken) old-school television set, a standing pendulum clock, and other objects to contribute to the flow of the room.

We wanted to work with textures and lightings that would create a unique feel to the room, and to utilize principles of physics in the pendulum objects which conform to Newtonian physics. The Newton's cradle we made rejects an idealized model in favor of realistic, damped periodic motion, using a custom damping constant in our rotation matrices for the strings and the balls.

# Advanced features
We made use of advanced features in our project to enhance the experience of exploring Mr. Prebble's room. 

**Mouse Picking** was implemented to allow for intuitive mouse interaction with the scene, examples including:
- triple-clicking to bring oneself to the default view of the scene
- clicking on any one of the two lights while in the default view of the scene to toggle between light sources
- clicking on any one of the balls of the Newton's cradle while the camera is attached to it to trigger on/off the damped swinging motion
- clicking on the right-side button of the television set while the camera is attached to it to turn on/off the TV
- clicking on the vinyl record player's red button while the camera is attached to the left side of the room to start/stop playing the music
- clicking on the stack of papers while the camera is attached to the left side of the room to pick up/release a paper

**Bump Mapping** was leveraged to achieve more sophisticated textures that are comparable to the corresponding real life object, namely for the walls of the room, but also for objects such as the rug under the table on which the Newton's cradle lies, the door, the sofa on the right side of the room (and the pillows), the television set, the Van Gogh painting, and the floor and ceiling.

**Collision Detection** was used, and is paramount to our Newton's cradle implementation.

And as aforementioned, **Physics** were incorporated to enable the damped periodic motion of our Newton's cradle and the tension of the strings to which the balls are attached, as well as for the periodic motion of the pendulum for the grandfather clock in the right corner.