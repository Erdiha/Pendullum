import {defs, tiny} from './examples/common.js';

const {
  Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene, Texture,
} = tiny;

const {Cube, Axis_Arrows, Textured_Phong} = defs

export class Pendulum extends Scene {
  constructor(context,program_state) {
    super();
    this.set_colors();
    this.shapes = {
      wll: new Cube(),
      box_2: new Cube(),
      shape_3: new Cube(),
      pen_skeleton: new defs.Cylindrical_Tube(4, 6),
      round_table: new defs.Rounded_Capped_Cylinder(10, 30),
      lamp: new defs.Rounded_Closed_Cone(10, 30),
      earth: new defs.Subdivision_Sphere(4),
      ball_light: new defs.Subdivision_Sphere(4),
      dry_wall: new defs.Square(10),
      pen_ball: new defs.Subdivision_Sphere(5),
      prism: new (defs.Capped_Cylinder.prototype.make_flat_shaded_version())(10, 100, [[0, 2], [0, 1]]),
      gem: new (defs.Subdivision_Sphere.prototype.make_flat_shaded_version())(4),
      tvv: new defs.Subdivision_Sphere(5),
      ball: new defs.Subdivision_Sphere(1, [[1, 2], [0, 1]]),
      tube: new defs.Cylindrical_Tube(7, 50, [[2, 21], [0, 1]]),
      clock_face: new defs.Capped_Cylinder(10, 50),
      line: new defs.Square(),
      clock_pend_rod: new defs.Square(),
      clock_pend_cyl: new defs.Capped_Cylinder(10, 50),
      clock_base: new defs.Cylindrical_Tube(4, 4),
    }
    this.scratchpad = document.createElement('canvas');
    this.scratchpad_context = this.scratchpad.getContext('2d');
    this.scratchpad.width = 256;
    this.scratchpad.height = 256;
    this.texture = new Texture("data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7");
    //for the  round table foot
    for(let p=-1;p<2;p++)
    {for(let k=-1;k<2;k++)
    {
      let t = 0.99;
      let l=0.81;
      let s =0.009;
      for(let m=-1;m<2;m++)
      {
        let first_mode = Mat4.translation(0,0,0)
          .times(Mat4.scale(t-s,t-s,t-s));
        Cube.insert_transformed_copy_into(this.shapes.shape_3,[],first_mode);
        for (let i = 1; i < 9; i++)
        {
          first_mode=first_mode.times(Mat4.scale(l,l,l));
          first_mode=first_mode.times(Mat4.scale(-k+s*s,-k+s*s,-k+s*s))
            .times(Mat4.translation(-m,k,-p));
          Cube.insert_transformed_copy_into(this.shapes.shape_3,[],first_mode);
          this.nn=first_mode;}}}
    }
    //materials
    let bump = new defs.Fake_Bump_Map(1);
    this.materials =
      {
        sofa_wood: new Material(bump, {color: color(0, 0, 0, 1), ambient: 0.7, specularity: 0.3, diffusivity: 0.5, texture: new Texture("assets/wood.png")}),
        news: new Material(new Textured_Phong(), {color: color(0, 0, 0, 1), ambient: 0.6, specularity: 0.4, diffusivity: 0.8, texture: new Texture("assets/news.jpg")}),
        tv: new Material(bump, {color: color(0, 0, 0, 1), ambient: 0.45, specularity: 0.45, diffusivity: 0.6, texture: new Texture("assets/tv1.png")}),
        pencil: new Material(new Textured_Phong(), {color: hex_color("#8d6262"), ambient: 0.6, specularity: 0.5, diffusivity: 0.5,}),
        sofa: new Material(bump, {color: hex_color("#800a0a"), ambient: 0.6, specularity: 0.45, diffusivity: 0.79, texture: new Texture("assets/sofa.jpg")  }),
        pillow: new Material(bump, {color: color(0, 0, 0, 1), ambient: 0.9, specularity: 0.25, diffusivity: 0.8, texture: new Texture("assets/pillow1.jpg")  }),
        phong: new Material(bump, {color: color(0, 0, 0, 1), ambient: 0.7, specularity: 0.3, diffusivity: 0.5, texture: new Texture("assets/w3.jpg")}),
        frame: new Material(bump, {color: color(0, 0, 0, 1), ambient: 0.8, specularity: 0.6, diffusivity: 0.5, texture: new Texture("assets/walltex.png")}),
        Edward: new Material(bump, {color: color(0, 0, 0, 1),  ambient: 0.68, diffusivity: 0.5, specularity: 0.35, texture: new Texture("assets/edward.jpg")}),
        paper: new Material(bump, {ambient: 0.35, diffusivity: 0.1, color: hex_color("#d6e3ff"), specularity: 0.6, texture: new Texture("assets/paper.png")}),
        test: new Material(bump, {ambient: 0.2, diffusivity: 0.1, color: hex_color("#d6e3ff"), specularity: 0.6,}),
        cornerlight: new Material(new Ring_Shader(), {color: color(0, 0, 0, 1), ambient: 0.7, diffusivity: 0.4, specularity: 0.5, texture: new Texture("assets/standlamp.png")}),
        vinyl: new Material(new Textured_Phong(), {color: color(0, 0, 0, 1), ambient: 0.7, diffusivity: 0.4, specularity: 0.5, texture: new Texture("assets/vinal.png")}),
        cornerlight_clicked: new Material(bump, {color: color(0, 0, 0, 1), ambient: 0.8, specularity: 0.3, diffusivity: 0.5, texture: new Texture("assets/standlamp.png")}),
        cornerlight_leg: new Material(new Textured_Phong(), {color: color(0, 0, 0, 1), ambient: 0.7, diffusivity: 0.1, specularity: 0.1, texture: new Texture("assets/standlamp.png")}),
        paint_texture: new Material(bump, {color: color(0, 0, 0, 1), ambient: 0.8, specularity: 0.3, diffusivity: 0.5, texture: new Texture("assets/painting.png")}),
        button: new Material(new Textured_Phong(), {color: color(0, 0, 0, 1), ambient: 0.55, specularity: 0.25, diffusivity: 0.3, texture: new Texture("assets/button.png")}),
        ceiling_light_tex: new Material(new Textured_Phong(), {color: hex_color("#beb9b9"), ambient: 0.5, diffusivity: 0.8, specularity: 0.8,}),
        walls: new Material(bump, {specularity: 0.11, ambient: 0.07, diffusivity: 0.5, color: hex_color("#b5cbc7"), texture: new Texture("assets/walltex.png")}),
        door: new Material(bump, {specularity: 0.45, ambient: 0.007, diffusivity: 0.55,  color: color(0.5, 0.5, 0.5, 1), texture: new Texture("assets/door.jpg")}),
        window: new Material(new Textured_Phong(), {specularity: 0.15, ambient: 0.65, diffusivity: 0.55,  color: color(0, 0, 0, 1), texture: new Texture("assets/outside.jpg")}),
        rug: new Material(bump,{specularity: 0.15, ambient: 0.65, diffusivity: 0.55,  color: color(0, 0, 0, 1), texture: new Texture("assets/rug1.jpg")}),
        walls2: new Material(bump,{specularity: 0.1, ambient: 0.01, diffusivity: 0.55, color: hex_color("#b5cbc7"), texture: new Texture("assets/walltex.png")}),
        p_ball: new Material(new Textured_Phong(), {color: hex_color("#b5b5b5"), specularity: 0.5, ambient: 0.4, diffusivity: 0.5, smothness: 97,}),
        earth_texture: new Material(new Textured_Phong(), {color: color(0, 0, 0, 1), specularity: 0.5, ambient: 1.5, diffusivity: 1, smothness: 97, texture: new Texture("assets/earth.gif")}),
        table_top: new Material(new Textured_Phong(), {color: color(0, 0, 0, 1), ambient: 0.7, diffusivity: 0.1, specularity: 0.1, texture: new Texture("assets/w3.jpg")}),
        table2: new Material(new Textured_Phong(), {color: color(0, 0, 0, 1), ambient: 0.7, diffusivity: 0.6, specularity: 0.1, texture: new Texture("assets/wood.png")}),
        floors: new Material(bump, {specularity: 0.3, ambient: 0.08, diffusivity: 0.65,color: hex_color("#b5cbc7"), texture: new Texture("assets/floor.png")}),
        ceilings: new Material(bump,{specularity: 0.3, ambient: 0.08, diffusivity: 0.65, color: hex_color("#b5cbc7"), texture: new Texture("assets/walltex.png")}),
        clock_texture: new Material(bump, {specularity: 0.4, ambient: 0.7, diffusivity: 1,color: color(0, 0, 0, 1), texture: new Texture("assets/clockface.jpg")}),
        clock_body: new Material(bump, {color: hex_color("#2a5849"), ambient: 0.65, diffusivity: 1, specularity: 0.9, texture: new Texture("assets/marble.jpg")}),
        clock_hand: new Material(bump, {color: hex_color("#000000")}),
        clock_hand2: new Material(bump, {color: hex_color("#ff0000")}),
        static: new Material(new Texture_Scroll(), {color: color( 0,0,0,1), ambient:0.5,specularity: 0.6,diffusivity:0.4, texture: new Texture("assets/static.jpeg")}),
        clock_pend_end: new Material(bump, {color: hex_color("#efdd8e"), specularity: 0.7, ambient: 0.5, diffusivity: 0.2, smothness: 97,}),
        static1: new Material(new Textured_Phong(), {color: color( 0,0,0,1), ambient:0.5,specularity: 0.6,diffusivity:0.6, texture: new Texture("assets/tv2.png")
      }),
    };
    this.switch =1;
    this.swing = 0;
    this.tv_play = 0;
    this.play_music = 0;
    this.ready = Boolean(false);
    this.tv_static = new Audio("assets/st.mp3");
    this.click = new Audio("assets/bump.wav");
    this.clickflag = 0;
    this.click.volume = 1;
    this.song = new Audio("assets/thesong.mp3");
    this.c1 = Mat4.translation(0, 0, 0);
    this.default_position = Mat4.identity().post_multiply(Mat4.translation(0, 0, 19));
    this.clock = Mat4.identity().post_multiply(Mat4.translation(17, -2.2, -6));
    this.tv_view = Mat4.identity().post_multiply(Mat4.translation(8, -3.5, -7));
    this.initial_camera_location = Mat4.look_at(vec3(0, 0, 18), vec3(0, 0, 0), vec3(0, 1, 0));
    this.MouseX = 0;
    this.MouseY = 0;
    this.PixelX = 0;
    this.PixelY = 0;
    this.Mouse3D = vec4(0, 0, 0, 1);
    this.clickTime = 0;
    this.click1End = 0;
    this.inverseMat = Mat4.identity();
    this.MouseDown = 0;
    this.clickRegister = 0;
    this.grabPaper = 0;
    this.paperOrigX = 0;
    this.paperOrigY = 0;
    this.paperDistX = 0;
    this.paperDistY = 0;
    this.topPaper1 = Mat4.identity();
    this.topPaper2 = Mat4.identity();
    this.topPaper3 = Mat4.identity();
    this.topPaper4 = Mat4.identity();
    this.topPaper5 = Mat4.identity();
    this.topPaper6 = Mat4.identity();
    this.topPaper7 = Mat4.identity();
    this.paperCount = 0;
    this.paperReset = 0;
    this.paperHold = Mat4.identity();
    this.damp = 0.005;
    this.swing_watcher = this.swing;
  }
  make_control_panel() {
    this.key_triggered_button("Default state", ["q"], () => this.spin = () =>  this.default_position );
    this.new_line();
    this.key_triggered_button("Attached to Vinyl player", ["m"], () => this.spin = () => this.music);
    this.key_triggered_button("Play the music", ["y"], () => this.play_music ^= 1);
    this.new_line();
    this.key_triggered_button("Attached to Pendullum", ["p"], () => this.spin = () => this.pendullum);
    this.key_triggered_button("Pendulum swing", ["x"], () => this.swing ^= 1);
    this.new_line();
    this.key_triggered_button("Attached to TV", ["t"], () => this.spin = () => this.tv_view);
    this.key_triggered_button("Turn TV on", ["v"], () => this.tv_play ^= 1);
    this.new_line();
    this.key_triggered_button("Attached to Earth", ["e"], () => this.spin = () => this.earth);
    this.new_line();
    this.key_triggered_button("Attached to Clock", ["c"], () => this.spin = () => this.clock);
    this.new_line();
    this.key_triggered_button("switch lights", ["l"], () => this.switch ^= 1);
    this.new_line();
    this.key_triggered_button("Attached to Sofa", ["b"], () => this.spin = () => this.sofa);
  }
  set_colors() {
    this.ccc = [color(Math.random(), Math.random(), Math.random(), 1), color(Math.random(), Math.random(), Math.random(), 1),
      color(Math.random(), Math.random(), Math.random(), 1), color(Math.random(), Math.random(), Math.random(), 1),
      color(Math.random(), Math.random(), Math.random(), 1), color(Math.random(), Math.random(), Math.random(), 1),
      color(Math.random(), Math.random(), Math.random(), 1)]
  }
  display(context, program_state) {
    
    if (!context.scratchpad.controls) {
      this.initial_camera_location = Mat4.look_at(vec3(0, 0, 19), vec3(0, 0, 0), vec3(0, 1, 0));
      this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
      program_state.set_camera(this.initial_camera_location);
    }
    
    let canvas = context.canvas;
    
    if (this.swing && this.damp < 20)
    {
      this.damp += 0.005;
      if (this.damp > 20)
        this.damp = 20;
    }
    if (this.swing_watcher != this.swing)
    {
      if (this.swing == 1 && this.swing_watcher == 0 && this.damp == 20)
        this.damp = 0.005;
      this.swing_watcher = this.swing;
    }
    canvas.addEventListener('mousedown', (e) => {
      const rect = canvas.getBoundingClientRect();
      this.MouseX = e.clientX - rect.left + 0.5;
      this.MouseY = e.clientY - rect.top;
      if (this.spin !== undefined && this.MouseDown === 0) {
        //this.clickRegister++;
        this.grabPaper = 0;
        if (this.spin() === this.tv_view){
          if ((this.MouseX > 591) &&(this.MouseX <608)
            &&(this.MouseY < 318) && (this.MouseY > 297)) {
            this.tv_play ^= 1;
          }
        } else if (this.spin() === this.music) {
          if ((this.MouseX > 510) && (this.MouseX < 530) && (this.MouseY > 520) && (this.MouseY < 545)) {
            this.play_music ^= 1;
          } else if ((this.MouseX > 725) && (this.MouseX < 835) && (this.MouseY > 500) && (this.MouseY < 535)) {
            this.grabPaper = 1;
            this.paperCount++;
            this.paperOrigX = this.MouseX;
            this.paperOrigY = this.MouseY;
          }
        } else if (this.spin() === this.pendullum) {
          if ((this.MouseX > 275) && (this.MouseX < 815) && (this.MouseY > 350) && (this.MouseY < 530)) {
            this.swing ^= 1;
          }
        } else if (this.spin() === this.default_position) {
          if (((this.MouseX > 160) && (this.MouseX < 210) && (this.MouseY > 210) && (this.MouseY < 270)) ||
            ((this.MouseX > 500) && (this.MouseX < 580) && (this.MouseY > 25) && (this.MouseY < 75))){
            this.switch ^= 1;
          }
        }
      }
      this.MouseDown = 1;
    });
    canvas.addEventListener('mouseup', (e) => {
      if (this.MouseDown === 1 && this.click1End === 0){
        this.click1End = program_state.animation_time;
      } else if (this.MouseDown === 1 && (program_state.animation_time - this.click1End > 300)) {
        this.click1End = 0;
      } else if (this.MouseDown === 1) {
        //Set this.spin to this.default_position
        this.clickTime = program_state.animation_time - this.click1End;
        this.spin = () =>  this.default_position;
      }
      
      this.MouseDown = 0;
    });
    
    program_state.projection_transform = Mat4.perspective(
      Math.PI / 4, context.width / context.height, .1, 1000);
    const t = program_state.animation_time / 1000, dt = program_state.animation_delta_time / 1000;
    this.t = t;
    let ll = Math.PI * ( t / 2.5 ) + 2;
    let c_light = Mat4.identity();
    const light_position = vec4(0, 6.5, 0, 4);
    program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 10**ll)];
    let cl =this.materials.ceiling_light_tex;
    if(!this.switch) {let light_position = vec4(-56, 10, -56, 4);program_state.lights = [new Light(light_position, this.ccc[4], 1000000)];cl = this.materials.test;}
    //ceiling light
    this.shapes.ball_light.draw(context,program_state,c_light.times(Mat4.translation(0,6.5,0)).times(Mat4.scale(1,0.5,1)),cl);
    //creates the room walls
    this.drawWalls(context,program_state);
    //creates the rectangle table
    this.drawTable1(context,program_state);
    //creates the pendullum
    this.drawPen(context,program_state);
    //creates the painting,rotating circles and round table
    this.drawFurniture(context,program_state);
    //creates stand light
    this.drawStandlight(context,program_state);
    //creates the window
    this.drawWindows(context,program_state);
    //creates the sofa
    this.drawSofa(context,program_state);
    //creates TV
    this.drawTV(context,program_state);
    //draw the clock
    this.drawClock(context,program_state);
    //camera attachment settings
    if( this.spin !== undefined)
    {
      if (this.spin()===this.initial_camera_location)
      {
        program_state.set_camera(this.initial_camera_location);
      }
      else if (this.spin()===this.default_position)
      {
        let new_cam = this.spin();
        program_state.set_camera(Mat4.inverse(new_cam.map((x, i) =>
          Vector.from(program_state.camera_transform[i]).mix(x, 0.08))));
      }
      else if (this.spin()===this.pendullum)
      {
        let new_cam = this.spin().times(Mat4.rotation(t/3 , 0, 1, 0))
          .times(Mat4.translation(0, -3, 7));
        program_state.set_camera(Mat4.inverse(new_cam.map((x, i) =>
          Vector.from(program_state.camera_transform[i]).mix(x, 0.08))));
      }
      else if(this.spin()===this.music)
      {
        let new_cam = this.spin().times(Mat4.rotation(Math.PI/2 , 0, 3, 0))
          .times(Mat4.translation(2.5, -2, -7.5));
        program_state.set_camera(Mat4.inverse(new_cam.map((x, i) =>
          Vector.from(program_state.camera_transform[i]).mix(x, 0.08))));
        if(this.play_music)
        {
          setTimeout(() => {  }, 1000);
          this.song.play();
        }
        else  //if(!this.play_music || this.spin()!==this.music)
        {
          setTimeout(() => { this.song.pause(); }, 1);
        }
        this.ready=true;
      }
      else if(this.spin()===this.clock)
      {
        let new_cam = this.spin();
        program_state.set_camera(Mat4.inverse(new_cam.map((x, i) =>
          Vector.from(program_state.camera_transform[i]).mix(x, 0.08))));
      }
      else if(this.spin()===this.earth)
      {
        let new_cam = this.spin().times(Mat4.rotation(Math.PI/200 , 0, 1, 0))
          .times(Mat4.translation(-9, -3.5, -9));
        program_state.set_camera(Mat4.inverse(new_cam.map((x, i) =>
          Vector.from(program_state.camera_transform[i]).mix(x, 0.08))));
      }
      //else if(this.spin()===this.tele)
      else if(this.spin()===this.tv_view)
      {
        let new_cam = this.spin();
        program_state.set_camera(Mat4.inverse(new_cam.map((x, i) =>
          Vector.from(program_state.camera_transform[i]).mix(x, 0.08))));
      }
      //attach to sofa
      else if(this.spin()===this.sofa)
      {
        let new_cam = this.spin().times(Mat4.rotation(-Math.PI/2 , 0, 1, 0))
          .times(Mat4.translation(-4, -2, -8.5));
        program_state.set_camera(Mat4.inverse(new_cam.map((x, i) =>
          Vector.from(program_state.camera_transform[i]).mix(x, 0.08))));
      }
    }
  }
  drawWindows(context, program_state) {
    //window---------------------------------
    let window=Mat4.identity();
    this.shapes.box_2.draw(context, program_state,
      window
        .times(Mat4.translation(10, -1, 19.8))
        .times(Mat4.rotation(Math.PI,0,1,0))
        .times(Mat4.scale(3, 3, 0.1))
      , this.materials.window);
    let frame=window;
    //left
    this.shapes.box_2.draw(context, program_state,
      frame
        .times(Mat4.translation(13.2, -1.2, 19.8))
        .times(Mat4.rotation(Math.PI,0,1,0))
        .times(Mat4.scale(0.2, 3, 0.1))
      , this.materials.frame);
    //middle
    this.shapes.box_2.draw(context, program_state,
      frame
        .times(Mat4.translation(9.8, -1.2, 19.799))
        .times(Mat4.rotation(Math.PI,0,1,0))
        .times(Mat4.scale(0.1, 3, 0.1))
      , this.materials.frame);
    //middle
    this.shapes.box_2.draw(context, program_state,
      frame
        .times(Mat4.translation(10, -1.2, 19.799))
        .times(Mat4.rotation(Math.PI,0,1,0))
        .times(Mat4.scale(0.1, 3, 0.1))
      , this.materials.frame);
    //right
    this.shapes.box_2.draw(context, program_state,
      frame
        .times(Mat4.translation(6.8, -1.2, 19.8))
        .times(Mat4.rotation(Math.PI,0,1,0))
        .times(Mat4.scale(0.2, 3, 0.1))
      , this.materials.frame);
    //bottom
    this.shapes.box_2.draw(context, program_state,
      frame
        .times(Mat4.translation(10, -4, 19.79))
        .times(Mat4.rotation(Math.PI/2,0,0,1))
        .times(Mat4.scale(0.2, 3.4, 0.1))
      , this.materials.frame);
    //top
    this.shapes.box_2.draw(context, program_state,
      frame
        .times(Mat4.translation(10, 1.8, 19.79))
        .times(Mat4.rotation(Math.PI/2,0,0,1))
        .times(Mat4.scale(0.3, 3.8, 0.1))
      , this.materials.frame);
    //handles
    this.shapes.gem.draw(context, program_state,
      frame
        .times(Mat4.translation(10.1, -0.9, 19.69))
        .times(Mat4.rotation(Math.PI/2,0,0,1))
        .times(Mat4.scale(0.4, 0.2, 0.15))
      , this.materials.phong.override(hex_color("#071a2f")));
    this.shapes.gem.draw(context, program_state,
      frame
        .times(Mat4.translation(9.67,-0.9,19.69))
        .times(Mat4.rotation(Math.PI/2,0,0,1))
        .times(Mat4.scale(0.4, 0.2, 0.15))
      , this.materials.phong.override(hex_color("#071a2f"),{specularity :0.1}));
    
    
  }
  drawTV(context, program_state) {
    //TV
    let stat = this.materials.static1;
    if(this.tv_play==1)
    {
      
      stat=this.materials.static;
      this.tv_static.play();
    }
    else if(this.tv_play==0){this.tv_static.pause();}
    
    let tv = Mat4.identity();
    tv=tv
      .times(Mat4.translation(8,-3,-19))
      .times(Mat4.scale(1.5,2.5,1))
    this.shapes.box_2.draw(context,program_state,tv,this.materials.tv);
    let screen=tv;
    
    this.shapes.clock_face.draw(context,program_state,screen
      .times(Mat4.translation(0.055,0.3,0.9))
      .times(Mat4.rotation(Math.PI,0,1,0))
      .times(Mat4.scale(0.69,0.48,0.3))
      ,stat);
    
    this.shapes.box_2.draw(context,program_state,
      tv.times(Mat4.translation(0,-0.3,0))
        .times(Mat4.scale(1.01,1.3,0.99))
      ,this.materials.phong);
    this.shapes.box_2.draw(context,program_state,
      tv.times(Mat4.scale(1.2,1.01,0.99))
      ,this.materials.cornerlight_leg);
    this.tele = tv;
  }
  drawTable1(context,program_state){
    //table top
    let table = this.c1.times(Mat4.translation(0,0,2))
    this.shapes.box_2.draw(context,program_state,
      table
        .times(Mat4.translation(0,-4.81,-4))
        .times(Mat4.scale(6,0.08,2.5)),this.materials.table_top);
    
    //tabel legs
    //backleft
    this.shapes.box_2.draw(context, program_state,
      table.times(Mat4.translation(-5.4, -5.83, -5))
        .times(Mat4.rotation(0.3,1,0,-1))
        .times(Mat4.scale(0.15, 1, 0.15))
      , this.materials.table_top);
    //backright
    this.shapes.box_2.draw(context, program_state,
      table
        .times(Mat4.translation(5.4, -5.83, -5))
        .times(Mat4.rotation(0.3,2,0,2))
        .times(Mat4.scale(0.15, 1, 0.15)), this.materials.table_top);
    //frontleft
    this.shapes.box_2.draw(context, program_state,
      table
        .times(Mat4.translation(-5.4, -5.83, -3.1))
        .times(Mat4.rotation(0.3,0,0,-1))
        .times(Mat4.scale(0.15, 1, 0.15)), this.materials.table_top);
    //frontright
    this.shapes.box_2.draw(context, program_state,
      table
        .times(Mat4.translation(5.4, -5.83, -3.1))
        .times(Mat4.rotation(0.3,1,0,4))
        .times(Mat4.scale(0.15, 1, 0.15)), this.materials.table_top);
    
  }
  drawWalls(context,program_state){
    let d1 = 20;
    let d2= 7;
    let n = 0.2
    //floor
    let wll2 = Mat4.identity();
    let s = this.materials.walls;
    if(!this.switch)
    {
      s = this.materials.walls2;
    }
    
    //ceiling
    let wll = Mat4.identity();
    //back
    this.shapes.box_2.draw(context,program_state,
      wll
        .times(Mat4.rotation(Math.PI/2,1,0,0))
        .times(Mat4.translation(0,d1,0))
        .times(Mat4.scale(d1,n,d2)),s);
    let door = wll;
    this.shapes.box_2.draw(context,program_state,
      door
        .times(Mat4.rotation(-Math.PI/2,1,0,0))
        .times(Mat4.translation(0,-19.8,-2))
        .times(Mat4.scale(3,0.2,5)),this.materials.door.override(hex_color("#BAB6A4")));
    //front
    this.shapes.box_2.draw(context,program_state,
      wll
        .times(Mat4.rotation(Math.PI/2,1,0,0))
        .times(Mat4.translation(0,-d1,0))
        .times(Mat4.scale(d1,n,d2)),this.materials.walls);
    //left
    this.shapes.box_2.draw(context,program_state,
      wll
        .times(Mat4.rotation(Math.PI/2,0,0,1))
        .times(Mat4.translation(0,d1,0))
        .times(Mat4.scale(d2,n,d1)),this.materials.walls);
    //right
    this.shapes.box_2.draw(context,program_state,
      wll
        .times(Mat4.rotation(Math.PI/2,0,0,1))
        .times(Mat4.translation(0,-d1,0))
        .times(Mat4.scale(d2,n,d1)),s);
    this.sofa=wll;
    //floor
    this.shapes.box_2.draw(context,program_state,
      wll2.times(Mat4.translation(0,-d2-0.01,0))
        .times(Mat4.scale(d1,n,d1)),this.materials.floors);
    //ceiling
    this.shapes.box_2.draw(context,program_state,
      wll.times(Mat4.translation(0,d2,0))
        .times(Mat4.scale(d1,n,d1)),this.materials.ceilings);
  }
  drawPen(context,program_state) {
    let t = this.t;
    //the sphere
    let pen_ball = Mat4.identity();
    let di = 0.15
    for (let i = -1; i < 2; i++) {
      this.shapes.pen_ball.draw(context, program_state, pen_ball
        .times(Mat4.translation(4 * i * di, -4.2, -1.75))
        .times(Mat4.scale(di + di, di + di, di + di))
        , this.materials.p_ball);
    }
    
    //pendullum skeleton
    this.pendullum = pen_ball;
    let pen_s = Mat4.identity();
    this.shapes.pen_skeleton.draw(context, program_state, pen_s
      .times(Mat4.scale(6, 2.5, 0.5))
      .times(Mat4.translation(0, -1.1, -3.5)), this.materials.p_ball);
    //strings (3 middle ones)-------------------------------------------------------
    let s = 0.03;
    let string = Mat4.identity().times(Mat4.translation(0.6, -4.2, -1.75)).times(Mat4.scale(s, s, s));
    for (let k = 0; k < 3; k++) {
      for (let i = 0; i < 60; i++) {
        this.shapes.pen_ball.draw(context, program_state,
          string.post_multiply(Mat4.translation(0, 2, 0)), this.materials.p_ball);
      }
      string = string.times(Mat4.translation(-20, -120, 0))
    }
    //-------------------------------------------------------------------------------
    //left string and ball
    let left_string = Mat4.identity().times(Mat4.scale(0.3, 0.3, 0.3)).times(Mat4.translation(-4, -1.85, -5.9))
      .times(Mat4.scale(0.1,0.1,0.1));
    var damp2 = this.damp;
    if (damp2 > 15)
      damp2 = 15;
    var max_sway_ang = (15-damp2)/10000;
    var max_rot_ang = (20-this.damp)/100;
    var sway_l = 0;
    var sway_r = 0;
    var sway_per_sec = 0.50;
    var time_norm = ((program_state.animation_time*sway_per_sec)%1000) / 1000;
    var sin_norm = Math.sin(time_norm*2*Math.PI);
    if (sin_norm >= 0){
      sway_l = sin_norm;
      sway_r = 0;
    } else {
      sway_r = Math.abs(sin_norm);
      sway_l = 0;
    }
    
    left_string.post_multiply(Mat4.rotation(-this.swing*sway_l*max_rot_ang*Math.PI, 0, 0, 1));
    for (let i=0;i<59;i++){
      this.shapes.pen_ball.draw(context,program_state,
        left_string.post_multiply(Mat4.translation(0, -2, 0)).
        post_multiply(Mat4.rotation(-this.swing*max_sway_ang*sway_l*Math.PI, 0, 0, 1)), this.materials.p_ball);
    }
    this.shapes.pen_ball.draw(context, program_state,
      left_string.post_multiply(Mat4.translation(0, -3, 0)).post_multiply(Mat4.scale(10, 10, 10)), this.materials.p_ball);
    if(this.swing && (Math.abs(sin_norm) <= 0.5))
    {
      if (this.clickflag)
        this.click.currentTime = 0;
      this.click.play();
      this.clickflag = 0;
      this.click.volume = (1 - this.damp/20.);
    }
    else {
      this.click.pause();
      this.click.currentTime = 0;
      this.clickflag = 1;
    }
    //right string and ball
    let right_string = Mat4.identity().times(Mat4.scale(0.3, 0.3, 0.3)).times(Mat4.translation(4, -2.05, -5.9))
      .times(Mat4.scale(0.1, 0.1, 0.1));
    right_string.post_multiply(Mat4.rotation(this.swing*sway_r*max_rot_ang*Math.PI, 0, 0, 1));
    this.shapes.pen_ball.draw(context, program_state, right_string, this.materials.p_ball);
    for (let i=0;i<58;i++){
      this.shapes.pen_ball.draw(context,program_state,
        right_string.post_multiply(Mat4.translation(0, -2, 0)).
        post_multiply(Mat4.rotation(this.swing*max_sway_ang*sway_r*Math.PI, 0, 0, 1)), this.materials.p_ball);
    }
    this.shapes.pen_ball.draw(context, program_state,
      right_string.post_multiply(Mat4.translation(0, -3, 0)).post_multiply(Mat4.scale(10, 10, 10)), this.materials.p_ball);
    
  }
  drawClock(context,program_state){
    let t =this.t;
    //clock
    //	clock pendulum
    let rod = Mat4.identity().times(Mat4.translation(17, -1.85, -16.75)).times(Mat4.scale(0.3, 0.3, 0.3)).times(Mat4.scale(0.1,0.1,0.1));
    var max_rot_ang = 2/100;
    var sway_per_sec = 0.50;
    var time_norm = ((program_state.animation_time*sway_per_sec)%1000) / 1000;
    var sin_norm = Math.sin(time_norm*2*Math.PI);
    
    rod = rod.times(Mat4.rotation(-1*sin_norm*max_rot_ang*Math.PI, 0, 0, 1));
    for (let i=0;i<59;i++){
      rod = rod.times(Mat4.translation(0, -2, 0));
      this.shapes.clock_pend_rod.draw(context,program_state,rod, this.materials.clock_pend_end);
    }
    
    rod = rod.times(Mat4.translation(0, -3, 0)).times(Mat4.scale(10, 10, 10));
    this.shapes.clock_pend_cyl.draw(context, program_state,rod, this.materials.clock_pend_end);
    
    //	structure
    let clock = Mat4.identity();
    clock = clock.times(Mat4.translation(17, 0, -17)).times(Mat4.scale(1, 1.5, 1));
    this.shapes.box_2.draw(context, program_state, clock, this.materials.clock_body.override({specularity: 1}));
    
    let base_t = Mat4.identity();
    base_t = base_t.times(Mat4.translation(17, -1.75, -17)).times(Mat4.scale(1, 0.25, 1));
    this.shapes.box_2.draw(context, program_state, base_t, this.materials.clock_body.override({specularity: 1}));
    
    let base_b = Mat4.identity();
    base_b = base_b.times(Mat4.translation(17, -6.6, -17)).times(Mat4.scale(1, 0.25, 1));
    this.shapes.box_2.draw(context, program_state, base_b, this.materials.clock_body.override({specularity: 1}));
    
    let base_l = Mat4.identity();
    base_l = base_l.times(Mat4.translation(16.2, -4.175, -17)).times(Mat4.scale(0.2, 2.175, 1));
    this.shapes.box_2.draw(context, program_state, base_l, this.materials.clock_body.override({specularity: 1}));
    
    let base_r = Mat4.identity();
    base_r = base_r.times(Mat4.translation(17.8, -4.175, -17)).times(Mat4.scale(0.2, 2.175, 1));
    this.shapes.box_2.draw(context, program_state, base_r, this.materials.clock_body.override({specularity: 1}));
    
    //	face
    let clock_face_mat = Mat4.identity();
    clock_face_mat = clock_face_mat.times(Mat4.translation(17, 0, -16)).times(Mat4.scale(0.9, 0.9, 0.2));
    this.shapes.clock_face.draw(context, program_state, clock_face_mat, this.materials.clock_texture);
    let clksc = Mat4.identity();
    let sc = -2*Math.PI*t/60;
    clksc = clksc.times(Mat4.translation(17, 0, -15.75)).times(Mat4.rotation(sc, 0, 0, 1)).times(Mat4.translation(0.01, 0.4, 0)).times(Mat4.scale(0.01, 0.4, 0.01));
    let clkmn = Mat4.identity();
    clkmn = clkmn.times(Mat4.translation(17, 0, -15.75)).times(Mat4.rotation(sc/60, 0, 0, 1)).times(Mat4.translation(0.01, 0.4, 0)).times(Mat4.scale(0.01, 0.4, 0.01));
    let clkhr = Mat4.identity();
    clkhr = clkhr.times(Mat4.translation(17, 0, -15.75)).times(Mat4.rotation(sc/360, 0, 0, 1)).times(Mat4.translation(0.01, 0.2, 0)).times(Mat4.scale(0.01, 0.2, 0.01));
    this.shapes.line.draw(context, program_state, clksc, this.materials.clock_hand2);
    this.shapes.line.draw(context, program_state, clkmn, this.materials.clock_hand);
    this.shapes.line.draw(context, program_state, clkhr, this.materials.clock_hand);
    
  }
  drawFurniture(context,program_state) {
    let t=this.t;
    let arm_move=0;
    let max_motion=0.5906981479833537;
    let record_move=0;
    let pin = Mat4.identity();
    this.music = pin;
    //record player-----------------------------------------------------
    //vinyl player--------------------------------------------
    this.shapes.box_2.draw(context,program_state, pin
      .times(Mat4.translation(-17,-4.6,-2))
      .times(Mat4.scale(1.2,0.2,1.2)),this.materials.ceilings.override(hex_color("#bbd4ff")));
    let front= pin;
    this.shapes.box_2.draw(context,program_state, front
      .times(Mat4.translation(-16.9,-4.6,-2))
      .times(Mat4.scale(1.2,0.18,1.17)),this.materials.ceilings.override(hex_color("#121824")));
    let buttons = pin;
    let add=0.15;
    let base=1;
    
    //square buttons------------------------------------------------------------
    for(let i=0;i<8;i++)
    {
      this.shapes.box_2.draw(context,program_state,
        buttons
          .times(Mat4.translation(-16.7,-4.6,-base))
          .times(Mat4.scale(1.2,0.1,.05)) ,this.materials.ceilings.override(hex_color("#dbc5a0")));
      base=base+add;
    }
    
    //study table oil painting
    let Edward = buttons;
    this.shapes.box_2.draw(context,program_state,
      Edward
        .times(Mat4.translation(-19.8,-1.6,-2.5))
        .times(Mat4.scale(0.1,3,2.5)) ,this.materials.Edward);
    
    //vinly table-----------------------------------------------------------------
    this.shapes.box_2.draw(context,program_state, front
      .times(Mat4.translation(-16.7,-5,-2.5))
      .times(Mat4.scale(2,0.18,5)),this.materials.ceilings.override(hex_color("#293541")));
    
    for(let i=0;i<5;i++)
    {
      this.shapes.box_2.draw(context,program_state, front
        .times(Mat4.translation(-16.7,-6,-2.5))
        .times(Mat4.scale(1,1,1)),this.materials.ceilings.override(hex_color("#41505f")));
    }
    //chair-----------------------------------------
    let chair=front;
    this.shapes.round_table.draw(context, program_state,chair
      .times(Mat4.translation(-13.3, -5.7, -2.5))
      .times(Mat4.rotation(1.5807,1, 0, 0))
      .times(Mat4.scale(0.8, 0.8, 0.13))
      ,this.materials.table_top.override(hex_color("#0e2d53")));
    let chair1=chair;
    this.shapes.round_table.draw(context, program_state,chair1
      .times(Mat4.translation(-12.8, -4.5, -2.5))
      .times(Mat4.rotation(1.5807,0, 1, 0))
      .times(Mat4.scale(0.65, 0.35, 0.13))
      ,this.materials.table_top);
    let c_legs = chair;
    this.shapes.box_2.draw(context, program_state,
      c_legs
        .times(Mat4.translation(-12.7, -5.6, -3))
        .times(Mat4.scale(0.079, 1.5, 0.079)), this.materials.table2);
    this.shapes.box_2.draw(context, program_state,
      c_legs
        .times(Mat4.translation(-12.7, -5.6, -2))
        .times(Mat4.scale(0.079, 1.5, 0.079)), this.materials.table2);
    this.shapes.box_2.draw(context, program_state,
      c_legs
        .times(Mat4.translation(-13.7, -6.3, -3))
        .times(Mat4.scale(0.079, 0.58, 0.079)), this.materials.table2);
    this.shapes.box_2.draw(context, program_state,
      c_legs
        .times(Mat4.translation(-13.7, -6.3, -2))
        .times(Mat4.scale(0.079, 0.58, 0.079)), this.materials.table2);
    //papers-----------------------------------------------------------------------
    let r_button;
    let an =-Math.PI/2;
    let y=0;
    let z=0.001;
    r_button=front
      .times(Mat4.translation(-16.7,-4.8,-5.5))
      .times(Mat4.rotation(an,1,0,0))
      .times(Mat4.scale(0.68,0.48,5))
    let rr_button=r_button
    for(let i=0;i<10;i++)
    {
      this.shapes.dry_wall.draw(context,program_state,rr_button
        .post_multiply(Mat4.translation(-z,-z,z))
        .times(Mat4.rotation(-an,0,0,1))
        ,this.materials.paper.override(hex_color("#d6d4d4")));
      y = y+0.1;
    }
    //draw top paper
    if (this.grabPaper) { // Change paper tranformation matrix if clicked
      let canvas = context.canvas;
      canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        this.MouseX = e.clientX - rect.left + 0.5;
        this.MouseY = e.clientY - rect.top;
        this.paperDistX = this.MouseX - this.paperOrigX;
        this.paperDistY = this.MouseY - this.paperOrigY;
        if (this.paperDistY > 0) {
          this.paperDistY = 0;
        }
      });
      let top_paper = Mat4.identity().times(Mat4.translation(-16.7,-4.8,-5.5)
        .times(Mat4.rotation(an,1,0,0))
        .times(Mat4.scale(0.68,0.48,5))
        .times(Mat4.translation(0, this.paperDistX/40, -this.paperDistY/380)));
      this.shapes.dry_wall.draw(context, program_state, top_paper, this.materials.paper.override(hex_color("#d6d4d4")));
      this.paperReset = 1;
      this.paperHold = top_paper;
      if (this.paperCount === 2) {
        this.shapes.dry_wall.draw(context, program_state, this.topPaper1, this.materials.paper.override(hex_color("#d6d4d4")));
      } else if (this.paperCount === 3) {
        this.shapes.dry_wall.draw(context, program_state, this.topPaper1, this.materials.paper.override(hex_color("#d6d4d4")));
        this.shapes.dry_wall.draw(context, program_state, this.topPaper2, this.materials.paper.override(hex_color("#d6d4d4")));
      } else if (this.paperCount === 4) {
        this.shapes.dry_wall.draw(context, program_state, this.topPaper1, this.materials.paper.override(hex_color("#d6d4d4")));
        this.shapes.dry_wall.draw(context, program_state, this.topPaper2, this.materials.paper.override(hex_color("#d6d4d4")));
        this.shapes.dry_wall.draw(context, program_state, this.topPaper3, this.materials.paper.override(hex_color("#d6d4d4")));
      } else if (this.paperCount === 5) {
        this.shapes.dry_wall.draw(context, program_state, this.topPaper1, this.materials.paper.override(hex_color("#d6d4d4")));
        this.shapes.dry_wall.draw(context, program_state, this.topPaper2, this.materials.paper.override(hex_color("#d6d4d4")));
        this.shapes.dry_wall.draw(context, program_state, this.topPaper3, this.materials.paper.override(hex_color("#d6d4d4")));
        this.shapes.dry_wall.draw(context, program_state, this.topPaper4, this.materials.paper.override(hex_color("#d6d4d4")));
      } else if (this.paperCount === 6) {
        this.shapes.dry_wall.draw(context, program_state, this.topPaper1, this.materials.paper.override(hex_color("#d6d4d4")));
        this.shapes.dry_wall.draw(context, program_state, this.topPaper2, this.materials.paper.override(hex_color("#d6d4d4")));
        this.shapes.dry_wall.draw(context, program_state, this.topPaper3, this.materials.paper.override(hex_color("#d6d4d4")));
        this.shapes.dry_wall.draw(context, program_state, this.topPaper4, this.materials.paper.override(hex_color("#d6d4d4")));
        this.shapes.dry_wall.draw(context, program_state, this.topPaper5, this.materials.paper.override(hex_color("#d6d4d4")));
      } else if (this.paperCount > 6) {
        this.shapes.dry_wall.draw(context, program_state, this.topPaper1, this.materials.paper.override(hex_color("#d6d4d4")));
        this.shapes.dry_wall.draw(context, program_state, this.topPaper2, this.materials.paper.override(hex_color("#d6d4d4")));
        this.shapes.dry_wall.draw(context, program_state, this.topPaper3, this.materials.paper.override(hex_color("#d6d4d4")));
        this.shapes.dry_wall.draw(context, program_state, this.topPaper4, this.materials.paper.override(hex_color("#d6d4d4")));
        this.shapes.dry_wall.draw(context, program_state, this.topPaper5, this.materials.paper.override(hex_color("#d6d4d4")));
        this.shapes.dry_wall.draw(context, program_state, this.topPaper6, this.materials.paper.override(hex_color("#d6d4d4")));
      }
    } else { // Let paper fall if second click occurs
      if (this.paperCount === 1) {
        if (this.paperReset === 1) {
          this.topPaper1 = this.paperHold;
          this.paperReset = 0;
        }
        this.shapes.dry_wall.draw(context, program_state, this.topPaper1, this.materials.paper.override(hex_color("#d6d4d4")));
      } else if (this.paperCount === 2) {
        if (this.paperReset === 1) {
          this.topPaper2 = this.paperHold;
          this.paperReset = 0;
        }
        this.shapes.dry_wall.draw(context, program_state, this.topPaper1, this.materials.paper.override(hex_color("#d6d4d4")));
        this.shapes.dry_wall.draw(context, program_state, this.topPaper2, this.materials.paper.override(hex_color("#d6d4d4")));
      } else if (this.paperCount === 3) {
        if (this.paperReset === 1) {
          this.topPaper3 = this.paperHold;
          this.paperReset = 0;
        }
        this.shapes.dry_wall.draw(context, program_state, this.topPaper1, this.materials.paper.override(hex_color("#d6d4d4")));
        this.shapes.dry_wall.draw(context, program_state, this.topPaper2, this.materials.paper.override(hex_color("#d6d4d4")));
        this.shapes.dry_wall.draw(context, program_state, this.topPaper3, this.materials.paper.override(hex_color("#d6d4d4")));
      } else if (this.paperCount === 4) {
        if (this.paperReset === 1) {
          this.topPaper4 = this.paperHold;
          this.paperReset = 0;
        }
        this.shapes.dry_wall.draw(context, program_state, this.topPaper1, this.materials.paper.override(hex_color("#d6d4d4")));
        this.shapes.dry_wall.draw(context, program_state, this.topPaper2, this.materials.paper.override(hex_color("#d6d4d4")));
        this.shapes.dry_wall.draw(context, program_state, this.topPaper3, this.materials.paper.override(hex_color("#d6d4d4")));
        this.shapes.dry_wall.draw(context, program_state, this.topPaper4, this.materials.paper.override(hex_color("#d6d4d4")));
      } else if (this.paperCount === 5) {
        if (this.paperReset === 1) {
          this.topPaper5 = this.paperHold;
          this.paperReset = 0;
        }
        this.shapes.dry_wall.draw(context, program_state, this.topPaper1, this.materials.paper.override(hex_color("#d6d4d4")));
        this.shapes.dry_wall.draw(context, program_state, this.topPaper2, this.materials.paper.override(hex_color("#d6d4d4")));
        this.shapes.dry_wall.draw(context, program_state, this.topPaper3, this.materials.paper.override(hex_color("#d6d4d4")));
        this.shapes.dry_wall.draw(context, program_state, this.topPaper4, this.materials.paper.override(hex_color("#d6d4d4")));
        this.shapes.dry_wall.draw(context, program_state, this.topPaper5, this.materials.paper.override(hex_color("#d6d4d4")));
      } else if (this.paperCount === 6) {
        if (this.paperReset === 1) {
          this.topPaper6 = this.paperHold;
          this.paperReset = 0;
        }
        this.shapes.dry_wall.draw(context, program_state, this.topPaper1, this.materials.paper.override(hex_color("#d6d4d4")));
        this.shapes.dry_wall.draw(context, program_state, this.topPaper2, this.materials.paper.override(hex_color("#d6d4d4")));
        this.shapes.dry_wall.draw(context, program_state, this.topPaper3, this.materials.paper.override(hex_color("#d6d4d4")));
        this.shapes.dry_wall.draw(context, program_state, this.topPaper4, this.materials.paper.override(hex_color("#d6d4d4")));
        this.shapes.dry_wall.draw(context, program_state, this.topPaper5, this.materials.paper.override(hex_color("#d6d4d4")));
        this.shapes.dry_wall.draw(context, program_state, this.topPaper6, this.materials.paper.override(hex_color("#d6d4d4")));
      } else if (this.paperCount > 6) {
        if (this.paperReset === 1) {
          this.topPaper7 = this.paperHold;
          this.paperReset = 0;
        }
        this.shapes.dry_wall.draw(context, program_state, this.topPaper1, this.materials.paper.override(hex_color("#d6d4d4")));
        this.shapes.dry_wall.draw(context, program_state, this.topPaper2, this.materials.paper.override(hex_color("#d6d4d4")));
        this.shapes.dry_wall.draw(context, program_state, this.topPaper3, this.materials.paper.override(hex_color("#d6d4d4")));
        this.shapes.dry_wall.draw(context, program_state, this.topPaper4, this.materials.paper.override(hex_color("#d6d4d4")));
        this.shapes.dry_wall.draw(context, program_state, this.topPaper5, this.materials.paper.override(hex_color("#d6d4d4")));
        this.shapes.dry_wall.draw(context, program_state, this.topPaper6, this.materials.paper.override(hex_color("#d6d4d4")));
        this.shapes.dry_wall.draw(context, program_state, this.topPaper7, this.materials.paper.override(hex_color("#d6d4d4")));
      }
    }
    //round button-----------------------------------------------------
    this.shapes.prism.draw(context,program_state,
      buttons
        .times(Mat4.translation(-16.33,-4.6,-2.9))
        .times(Mat4.rotation(Math.PI/2,0,1,0))
        .times(Mat4.scale(0.15,0.15,1.4)) ,this.materials.button.override(hex_color("#000000")));
    
    //the pen--------------------------------------------------------------
    let p = buttons;
    this.shapes.prism.draw(context,program_state,
      p
        .times(Mat4.translation(-17.15,-4.8,-4.9))
        .times(Mat4.rotation(0.1,0,1,0))
        .times(Mat4.scale(0.7,0.015,0.015)) ,this.materials.pencil);
    
    //red button------------------------------------------------------------
    let b= buttons
      .times(Mat4.translation(-16.7,-4.6,-base-0.09))
      .times(Mat4.scale(1.2,0.1,.08))
    if( this.ready===true)
    {
      if(this.play_music)
      {
        arm_move=max_motion;
        record_move=this.t*2;
        b= buttons
          .times(Mat4.translation(-16.8,-4.6,-base-0.09))
          .times(Mat4.scale(1.2,0.1,.08)) }
    }
    //arm------------------------------------------------------------------
    this.shapes.box_2.draw(context,program_state,b
      ,this.materials.ceilings.override(hex_color("#d24738")));
    let arm = Mat4.identity().times(Mat4.translation(-15.9,-4.35,-1.2));
    arm=arm.times(Mat4.rotation(arm_move,0,1,0)).times(Mat4.translation(0,0,-0.7));
    this.shapes.box_2.draw(context,program_state, arm.times(Mat4.scale(0.02,0.02,0.8))
      ,this.materials.cornerlight_leg)
    //vinyl record--------------------------------------------------------------
    pin=pin.times(Mat4.translation(-17,-4.4,-2)).times(Mat4.scale(1, 0.05, 1))
      .times(Mat4.rotation(Math.PI/2,1,0,0));
    this.shapes.prism.draw(context,program_state,
      pin.post_multiply(Mat4.rotation(record_move,0,0,1))
      ,this.materials.vinyl);
    
    //-----------------------------------------------------------------------------------------------------
    //painting
    let painting_model = Mat4.identity().times(Mat4.translation(0,0,-19)).times(Mat4.scale(4,3,0.1));
    this.shapes.box_2.draw(context,program_state,painting_model,this.materials.paint_texture)
    let dx=10;
    let dy=3;
    let dz=17;
    //rotating circles
    let moving_Circle = Mat4.identity();
    this.shapes.tube.draw(context, program_state,moving_Circle
      .times(Mat4.translation(-dx, -dy, -dz))
      .times(Mat4.rotation(t,1, 0, 1))
      .times(Mat4.scale(0.9, 0.9, 0.2))
      ,this.materials.test.override(hex_color("#fffd28")));
    this.shapes.tube.draw(context, program_state,moving_Circle
      .times(Mat4.translation(-dx, -dy, -dz))
      .times(Mat4.rotation(t,0, 1, 1))
      .times(Mat4.scale(1.1, 1.1, 0.2))
      ,this.materials.test.override(hex_color("#43d07d")));
    this.shapes.tube.draw(context, program_state,moving_Circle
      .times(Mat4.translation(-dx, -dy, -dz))
      .times(Mat4.rotation(t,1, 1, 0))
      .times(Mat4.scale(1.3, 1.3, 0.2))
      ,this.materials.test.override(hex_color("#c53878")));
    //earth
    let planet = moving_Circle;
    this.shapes.earth.draw(context, program_state,planet
      .times(Mat4.translation(-dx, -dy, -dz))
      .times(Mat4.rotation(t/2,0.23, 1, 0))
      .times(Mat4.scale(0.7, 0.7, 0.7))
      ,this.materials.earth_texture);
    this.earth=planet;
    
    //round table
    this.shapes.round_table.draw(context, program_state,moving_Circle
      .times(Mat4.translation(-dx, -4.5, -dz))
      .times(Mat4.rotation(1.5807,1, 0, 0))
      .times(Mat4.scale(2, 2, 0.13))
      ,this.materials.table_top);
    //round table legs
    this.shapes.shape_3.draw(context, program_state,
      this.nn.times(Mat4.translation(-57,-32,-95.7))
        .times(Mat4.rotation(1,0,1,0)), this.materials.table2);
    //round table neck
    let round_table_leg = Mat4.identity();
    this.shapes.box_2.draw(context, program_state,
      round_table_leg
        .times(Mat4.translation(-dx, -5.5, -dz))
        //.times(Mat4.rotation(0.3,1,0,4))
        .times(Mat4.scale(0.079, 1, 0.079)), this.materials.table2);
    //rug-----------------------------------------------------------------------------
    let rug = Mat4.identity();
    this.shapes.prism.draw(context, program_state,
      rug
        .times(Mat4.translation(0, -6.73, 0))
        .times(Mat4.rotation(Math.PI,0,1,1))
        .times(Mat4.scale(12, 12, 0.1))
      , this.materials.rug);
    //-----------------------------------------------------------------------------------
  }
  drawStandlight(context,program_state) {
    let leg = Mat4.identity();
    this.shapes.box_2.draw(context, program_state,leg
      .times(Mat4.translation(-18.3, -6.7, -18.3))
      .times(Mat4.rotation(1.5807,1, 0, 0))
      .times(Mat4.scale(1, 1, 0.13))
      ,this.materials.cornerlight_leg);
    
    //stand lights
    let w_ligts = Mat4.identity().times(Mat4.scale(1, 3, 1));
    let mat = this.materials.cornerlight;
    if (!this.switch)
    {
      mat=this.materials.cornerlight_clicked.override(this.ccc[4])
    }
    this.shapes.tube.draw(context, program_state,w_ligts
      .times(Mat4.rotation(-Math.PI/2,1,0,0))
      .times(Mat4.translation(-18.3, 18.3, 1))
      ,mat);
    
    //light rod
    let rod =  Mat4.identity();
    this.shapes.prism.draw(context,program_state,
      rod .times(Mat4.rotation(-Math.PI/2,1,0,0))
        .times(Mat4.translation(-18.3,18.3,-2.3))
        .times(Mat4.scale(0.15,0.15,9)),this.materials.p_ball.override(hex_color("#706666")));
    
  }
  drawSofa(context,program_state){
    //sofa--------------------------------------------------
    let sofa=Mat4.identity();
    let sofa_back= Mat4.identity().times(Mat4.scale(1,1,1));
    this.shapes.box_2.draw(context,program_state,sofa_back
      .times(Mat4.translation(18.5,-3.2,-3.97))
      .times(Mat4.scale(0.1,0.1,4.7)), this.materials.sofa_wood);
    
    sofa_back= sofa_back
      .times(Mat4.translation(17.8,-3.2,-8.55))
      .times(Mat4.rotation(Math.PI/2,0,1,0))
      .times(Mat4.scale(0.1,0.1,0.76)),
      this.shapes.box_2.draw(context,program_state,sofa_back,
        this.materials.sofa_wood);
    this.shapes.box_2.draw(context,program_state,
      sofa_back.post_multiply(Mat4.translation(-91.7,0,0))
      , this.materials.sofa_wood);
    
    //sofa bed---------------------------------------------------------
    this.shapes.prism.draw(context,program_state,sofa
      .times(Mat4.translation(18,-5,-4))
      .times(Mat4.scale(1.5,0.2,10))
      .times(Mat4.rotation(Math.PI , 1, 0, 0))
      ,this.materials.sofa);
    let sofaleg = sofa.times(Mat4.translation(18.5,-5,-9.1))
      .times(Mat4.scale(0.09,1.8,0.09))
    //newspaper
    let news=Mat4.identity().times(Mat4.translation(17.5,-3.8,-1))
      .times(Mat4.rotation(-Math.PI/2, 0, 6, 0.95))
    this.shapes.clock_pend_rod.draw(context,program_state,news
      .times(Mat4.scale(0.6,1,0.1))
      ,this.materials.news.override({ ambient: 0.75, specularity: 0.5, diffusivity: 0.5}));
    
    
    //sofa back-------------------------------------------------------------
    let a=6;
    for(let i=0;i<18;i++)
    {
      this.shapes.box_2.draw(context,program_state, sofaleg.post_multiply(Mat4.translation(0,0,a))
        ,this.materials.sofa_wood);
    }
    this.shapes.box_2.draw(context,program_state, sofaleg.post_multiply(Mat4.translation(-15,0,0))
      ,this.materials.sofa_wood);
    this.shapes.box_2.draw(context,program_state, sofaleg.post_multiply(Mat4.translation(0,0,-102))
      ,this.materials.sofa_wood);
    
    //pillow---------------------------------------------
    let pillow=Mat4.identity();
    this.shapes.gem.draw(context,program_state, pillow
      .times(Mat4.translation(18,-4,-7.8))
      .times(Mat4.rotation(-Math.PI/5,1,1,0))
      .times(Mat4.scale(1,1,0.5))
      ,this.materials.pillow);
    this.shapes.gem.draw(context,program_state, pillow
      .times(Mat4.translation(18,-4,-.1))
      .times(Mat4.rotation(Math.PI/5,4,4,0))
      .times(Mat4.scale(1,1,0.5))
      ,this.materials.pillow);
    pillow=pillow
      .times(Mat4.translation(18.1,-4,-8))
      .times(Mat4.rotation(Math.PI/2,0,1,0))
      .times(Mat4.scale(1,1,0.5))
    for(let i=0;i<3;i++)
    {this.shapes.gem.draw(context,program_state, pillow.post_multiply((Mat4.translation(-2.1,0,0)))
      ,this.materials.pillow);}
    //-------------------------------------------------------------------------
  }
}
//used for the static scrolling
class Texture_Scroll extends Textured_Phong {
  fragment_glsl_code() {
    return this.shared_glsl_code() +
      `
            varying vec2 f_tex_coord;
            uniform sampler2D texture;
            uniform float animation_time;
            
            void main(){
                // Sample the texture image in the correct place:
                
                vec4 tex_color = texture2D( texture,
                
                vec2(f_tex_coord.y+0.95*mod(animation_time,float(2.0)),
                 f_tex_coord.x+1.01*mod((animation_time/8.0),float(2.0))) );                if( tex_color.w < .01 ) discard;
                                                                         // Compute an initial (ambient) color:
                gl_FragColor = vec4( ( tex_color.xyz + shape_color.xyz ) * ambient, shape_color.w * tex_color.w );
                                                                         // Compute the final color with contributions from lights:
                gl_FragColor.xyz += phong_model_lights( normalize( N ), vertex_worldspace );
        } `;
  }
}
//used for the stand lamp translucent look
class Ring_Shader extends Shader {
  update_GPU(context, gpu_addresses, graphics_state, model_transform, material) {
    // update_GPU():  Defining how to synchronize our JavaScript's variables to the GPU's:
    const [P, C, M] = [graphics_state.projection_transform, graphics_state.camera_inverse, model_transform],
      PCM = P.times(C).times(M);
    context.uniformMatrix4fv(gpu_addresses.model_transform, false, Matrix.flatten_2D_to_1D(model_transform.transposed()));
    context.uniformMatrix4fv(gpu_addresses.projection_camera_model_transform, false,
      Matrix.flatten_2D_to_1D(PCM.transposed()));
  }
  
  shared_glsl_code() {
    return `
        precision mediump float;
        varying vec4 point_position;
        varying vec4 center;
        `;
  }
  vertex_glsl_code() {
    return this.shared_glsl_code() + `
        attribute vec3 position;
        uniform mat4 model_transform;
        uniform mat4 projection_camera_model_transform;
        
        void main(){
        vec2 zz = vec2(0,0);
        vec2 pos = vec2(position.z,1);
        center = vec4(zz,pos);
        point_position = vec4(position,1.0);
        gl_Position = projection_camera_model_transform * vec4( position, 1.0 );
        
        }`;
  }
  
  fragment_glsl_code() {
    return this.shared_glsl_code() + `
        void main(){
           vec2 first = vec2(0.6, 0.6);
           vec2 second = vec2(0.6 ,.9);
           vec4 total = vec4(first,second);
           float dist = (9.0 + cos(distance(center, point_position))/0.7);
           gl_FragColor =0.08 * total * dist;
        }`;
  }
}




