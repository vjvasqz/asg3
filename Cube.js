class Cube {
  constructor(textureNum = -2, texWeight = 1.0) {
      this.type = 'cube';
      this.color = [1.0,1.0,1.0,1.0];
      this.matrix = new Matrix4();
      this.textureNum = textureNum;
      this.texWeight = texWeight;
  }

  render() {
      var rgba = this.color;
      // Pass the texture number
      gl.uniform1i(u_WhichTexture, this.textureNum);
      // Pass the color of a point to u_FragColor variable
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      gl.uniform1f(u_texColorWeight, this.texWeight);
      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

      let allVertices = [];
      let allUVs = [];

      if (this.textureNum === 0) { //snow-block texture
          // Back
          allVertices = allVertices.concat([0,0,0, 1,1,0, 1,0,0]);
          allUVs = allUVs.concat([0.5,0, 0,0.5, 0,0]);
          allVertices = allVertices.concat([0,0,0, 0,1,0, 1,1,0]);
          allUVs = allUVs.concat([0.5,0, 0.5,0.5, 0,0.5]);

          // Top
          allVertices = allVertices.concat([0,1,0, 0,1,1, 1,1,1]);
          allUVs = allUVs.concat([0,1, 0.48,1, 0.5,0.48]);
          allVertices = allVertices.concat([0,1,0, 1,1,1, 1,1,0]);
          allUVs = allUVs.concat([0,1, 0.5,0.5, 0,0.5]);

          // Right
          allVertices = allVertices.concat([1,0,0, 1,1,1, 1,1,0]);
          allUVs = allUVs.concat([0.5,0.5, 1,1, 0.5,1]);
          allVertices = allVertices.concat([1,0,0, 1,0,1, 1,1,1]);
          allUVs = allUVs.concat([0.5,0.5, 1,0.5, 1,1]);

          // Left
          allVertices = allVertices.concat([0,0,0, 0,1,1, 0,1,0]);
          allUVs = allUVs.concat([0.5,0.5, 1,1, 0.5,1]);
          allVertices = allVertices.concat([0,0,0, 0,0,1, 0,1,1]);
          allUVs = allUVs.concat([0.5,0.5, 1,0.5, 1,1]);

          // Front
          allVertices = allVertices.concat([0,0,1, 1,1,1, 1,0,1]);
          allUVs = allUVs.concat([0.5,0, 0,0.5, 0,0]);
          allVertices = allVertices.concat([0,0,1, 0,1,1, 1,1,1]);
          allUVs = allUVs.concat([0.5,0, 0.5,0.5, 0,0.5]);

          // Bottom
          allVertices = allVertices.concat([0,0,0, 1,0,1, 1,0,0]);
          allUVs = allUVs.concat([0.5,0.5, 1,0, 1,0.5]);
          allVertices = allVertices.concat([0,0,0, 0,0,1, 1,0,1]);
          allUVs = allUVs.concat([0.5,0.5, 0.5,0, 1,0]);

      } else { //ice-block or any other texture
          // Front
          allVertices = allVertices.concat([0,0,0, 1,1,0, 1,0,0]);
          allUVs = allUVs.concat([0,0, 1,1, 1,0]);
          allVertices = allVertices.concat([0,0,0, 0,1,0, 1,1,0]);
          allUVs = allUVs.concat([0,0, 0,1, 1,1]);

          // Top
          allVertices = allVertices.concat([0,1,0, 0,1,1, 1,1,1]);
          allUVs = allUVs.concat([0,0, 0,1, 1,1]);
          allVertices = allVertices.concat([0,1,0, 1,1,1, 1,1,0]);
          allUVs = allUVs.concat([0,0, 1,1, 1,0]);

          // Right
          allVertices = allVertices.concat([1,0,0, 1,1,1, 1,1,0]);
          allUVs = allUVs.concat([0,0, 1,1, 0,1]);
          allVertices = allVertices.concat([1,0,0, 1,0,1, 1,1,1]);
          allUVs = allUVs.concat([0,0, 1,0, 1,1]);

          // Left
          allVertices = allVertices.concat([0,0,0, 0,1,1, 0,1,0]);
          allUVs = allUVs.concat([1,0, 0,1, 0,0]);
          allVertices = allVertices.concat([0,0,0, 0,0,1, 0,1,1]);
          allUVs = allUVs.concat([1,0, 1,1, 0,1]);

          // Back
          allVertices = allVertices.concat([0,0,1, 1,1,1, 1,0,1]);
          allUVs = allUVs.concat([1,0, 0,1, 0,0]);
          allVertices = allVertices.concat([0,0,1, 0,1,1, 1,1,1]);
          allUVs = allUVs.concat([1,0, 1,1, 0,1]);

          // Bottom
          allVertices = allVertices.concat([0,0,0, 1,0,1, 1,0,0]);
          allUVs = allUVs.concat([0,0, 1,1, 1,0]);
          allVertices = allVertices.concat([0,0,0, 0,0,1, 1,0,1]);
          allUVs = allUVs.concat([0,0, 0,1, 1,1]);
      }

      // Draw all triangles at once
      drawTriangle3DUV(allVertices, allUVs);
  }
}


// OLD Cube but needed to be more efficient

// class Cube{
//     constructor(textureNum = -2, texWeight = 1.0){
//       this.type = 'cube';
//       this.color = [1.0,1.0,1.0,1.0];
//       this.matrix = new Matrix4();
//       this.textureNum = textureNum;
//       this.texWeight = texWeight;
//     }

//     render(){
//       var rgba = this.color;
//       // Pass the texture number
//       gl.uniform1i(u_WhichTexture, this.textureNum);
//       // Pass the color of a point to u_FragColor variable
//       gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
//       gl.uniform1f(u_texColorWeight, this.texWeight);
//       gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

//       if (this.textureNum === 0){ //snow-block texture
//         // Back
//         drawTriangle3DUV([0,0,0, 1,1,0, 1,0,0], [0.5,0, 0,0.5, 0,0]);
//         drawTriangle3DUV([0,0,0, 0,1,0, 1,1,0], [0.5,0, 0.5,0.5, 0,0.5]);

//         // Top
//         drawTriangle3DUV([0,1,0, 0,1,1, 1,1,1], [0,1, 0.48,1, 0.5,0.48]);//[0,1, 0.5,1, 0.5,0.5]
//         drawTriangle3DUV([0,1,0, 1,1,1, 1,1,0], [0,1, 0.5,0.5, 0,0.5]);//[0,1, 0.5,0.5, 0.5,1]

//         // Right
//         drawTriangle3DUV([1,0,0, 1,1,1, 1,1,0], [0.5,0.5, 1,1, 0.5,1]);//
//         drawTriangle3DUV([1,0,0, 1,0,1, 1,1,1], [0.5,0.5, 1,0.5, 1,1]);

//         // Left
//         drawTriangle3DUV([0,0,0, 0,1,1, 0,1,0], [0.5,0.5, 1,1, 0.5,1]);// [1,0.5, 0.5,1, 1,1]
//         drawTriangle3DUV([0,0,0, 0,0,1, 0,1,1], [0.5,0.5, 1,0.5, 1,1]);

//         // Front
//         drawTriangle3DUV([0,0,1, 1,1,1, 1,0,1], [0.5,0, 0,0.5, 0,0]);
//         drawTriangle3DUV([0,0,1, 0,1,1, 1,1,1], [0.5,0, 0.5,0.5, 0,0.5]);

//         // Bottom
//         drawTriangle3DUV([0,0,0, 1,0,1, 1,0,0], [0.5,0.5, 1,0, 1,0.5]);
//         drawTriangle3DUV([0,0,0, 0,0,1, 1,0,1], [0.5,0.5, 0.5,0, 1,0]);
//         // drawTriangle3DUV([0,0,0, 1,0,1, 1,0,0], [0.5,0.5, 1,0, 1,0.5]);
//         // drawTriangle3DUV([0,0,0, 0,0,1, 1,0,1], [0.5,0.5, 0.5,0, 1,0]);

//       } else { //ice-block or any other texture
//         // Front
//         drawTriangle3DUV([0,0,0, 1,1,0, 1,0,0], [0,0, 1,1, 1,0]);
//         drawTriangle3DUV([0,0,0, 0,1,0, 1,1,0], [0,0, 0,1, 1,1]);

//         // Top
//         drawTriangle3DUV([0,1,0, 0,1,1, 1,1,1], [0,0, 0,1, 1,1]);
//         drawTriangle3DUV([0,1,0, 1,1,1, 1,1,0], [0,0, 1,1, 1,0]);

//         // Right
//         drawTriangle3DUV([1,0,0, 1,1,1, 1,1,0], [0,0, 1,1, 0,1]);
//         drawTriangle3DUV([1,0,0, 1,0,1, 1,1,1], [0,0, 1,0, 1,1]);

//         // Left
//         drawTriangle3DUV([0,0,0, 0,1,1, 0,1,0], [1,0, 0,1, 0,0]);
//         drawTriangle3DUV([0,0,0, 0,0,1, 0,1,1], [1,0, 1,1, 0,1]);

//         // Back
//         drawTriangle3DUV([0,0,1, 1,1,1, 1,0,1], [1,0, 0,1, 0,0]);
//         drawTriangle3DUV([0,0,1, 0,1,1, 1,1,1], [1,0, 1,1, 0,1]);

//         // Bottom
//         drawTriangle3DUV([0,0,0, 1,0,1, 1,0,0], [0,0, 1,1, 1,0]);
//         drawTriangle3DUV([0,0,0, 0,0,1, 1,0,1], [0,0, 0,1, 1,1]);

//       }
//     }
// }

    // render(){
    //   var rgba = this.color;
    //   // Pass the texture number
    //   gl.uniform1i(u_WhichTexture, this.textureNum);
    //   // Pass the color of a point to u_FragColor variable
    //   gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    //   gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);


    //   // Front
    //   drawTriangle3DUV([0,0,0, 1,1,0, 1,0,0], [0,0, 1,1, 1,0]);
    //   drawTriangle3DUV([0,0,0, 0,1,0, 1,1,0], [0,0, 0,1, 1,1]);

    //   // Top
    //   drawTriangle3DUV([0,1,0, 0,1,1, 1,1,1], [0,0, 0,1, 1,1]);
    //   drawTriangle3DUV([0,1,0, 1,1,1, 1,1,0], [0,0, 1,1, 1,0]);

    //   // Right
    //   drawTriangle3DUV([1,0,0, 1,1,1, 1,1,0], [0,0, 1,1, 0,1]);
    //   drawTriangle3DUV([1,0,0, 1,0,1, 1,1,1], [0,0, 1,0, 1,1]);

    //   // Left
    //   drawTriangle3DUV([0,0,0, 0,1,1, 0,1,0], [1,0, 0,1, 0,0]);
    //   drawTriangle3DUV([0,0,0, 0,0,1, 0,1,1], [1,0, 1,1, 0,1]);

    //   // Back
    //   drawTriangle3DUV([0,0,1, 1,1,1, 1,0,1], [1,0, 0,1, 0,0]);
    //   drawTriangle3DUV([0,0,1, 0,1,1, 1,1,1], [1,0, 1,1, 0,1]);

    //   // Bottom
    //   drawTriangle3DUV([0,0,0, 1,0,1, 1,0,0], [0,0, 1,1, 1,0]);
    //   drawTriangle3DUV([0,0,0, 0,0,1, 1,0,1], [0,0, 0,1, 1,1]);


    //   //drawCube(this.matrix);
    // }