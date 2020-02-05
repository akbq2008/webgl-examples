main()
function main() {
    const canvas = document.querySelector('#glcanvas')
    const gl = canvas.getContext('webgl')
    // HTMLCanvasElement.getContext() 方法返回canvas 的上下文，如果上下文没有定义则返回 null (即浏览器不支持).
    if (!gl) {
        alert(
            'Unable to initialize WebGL. Your browser or machine may not support it.'
        )
        return
    }
    // 顶点着色器
    // https://blog.csdn.net/qjh5606/article/details/82592207 glsl中文手册
    const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    varying lowp vec4 vColor;
    void main() {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vColor = aVertexColor;
    }
  `
    // 片段着色器
    const fsSource = `
    varying lowp vec4 vColor;
    void main() {
      gl_FragColor = vColor;
    }
            `
    // 初始化着色器
    const shaderProgram = initShaderProgram(gl, vsSource, fsSource)

    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(
                shaderProgram,
                'aVertexPosition'
            ),
            vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(
                shaderProgram,
                'uProjectionMatrix'
            ),
            modelViewMatrix: gl.getUniformLocation(
                shaderProgram,
                'uModelViewMatrix'
            ),
        },
    }
    /**
     * @description: 创建对象
     * @param {type} 渲染上下文
     * @return:
     */

    function initBuffers(gl) {
        const squareVerticesBuffer = gl.createBuffer() // 创建 WebGLBuffer 对象
        gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer) // 把 WebGLBuffer 对象绑定到指定目标上。
        var positions = [
            // Front face
            -1.0,
            -1.0,
            1.0,
            1.0,
            -1.0,
            1.0,
            1.0,
            1.0,
            1.0,
            -1.0,
            1.0,
            1.0,

            // Back face
            -1.0,
            -1.0,
            -1.0,
            -1.0,
            1.0,
            -1.0,
            1.0,
            1.0,
            -1.0,
            1.0,
            -1.0,
            -1.0,

            // Top face
            -1.0,
            1.0,
            -1.0,
            -1.0,
            1.0,
            1.0,
            1.0,
            1.0,
            1.0,
            1.0,
            1.0,
            -1.0,

            // Bottom face
            -1.0,
            -1.0,
            -1.0,
            1.0,
            -1.0,
            -1.0,
            1.0,
            -1.0,
            1.0,
            -1.0,
            -1.0,
            1.0,

            // Right face
            1.0,
            -1.0,
            -1.0,
            1.0,
            1.0,
            -1.0,
            1.0,
            1.0,
            1.0,
            1.0,
            -1.0,
            1.0,

            // Left face
            -1.0,
            -1.0,
            -1.0,
            -1.0,
            -1.0,
            1.0,
            -1.0,
            1.0,
            1.0,
            -1.0,
            1.0,
            -1.0,
        ]
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(positions),
            gl.STATIC_DRAW
        )
        // WebGL并不能直接操作JS数组，我们需要把它转换成类型化数组然后载入缓冲区
        var colors = [
            [1.0, 1.0, 1.0, 1.0], // Front face: white
            [1.0, 0.0, 0.0, 1.0], // Back face: red
            [0.0, 1.0, 0.0, 1.0], // Top face: green
            [0.0, 0.0, 1.0, 1.0], // Bottom face: blue
            [1.0, 1.0, 0.0, 1.0], // Right face: yellow
            [1.0, 0.0, 1.0, 1.0], // Left face: purple
        ]
        var generatedColors = []

        for (j = 0; j < colors.length; ++j) {
            var c = colors[j]
            for (var i = 0; i < 4; i++) {
                generatedColors = generatedColors.concat(c)
            }
        }

        var colorBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(generatedColors),
            gl.STATIC_DRAW
        )

        var cubeVerticesIndexBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVerticesIndexBuffer)

        // This array defines each face as two triangles, using the
        // indices into the vertex array to specify each triangle's
        // position.

        var cubeVertexIndices = [
            0,
            1,
            2,
            0,
            2,
            3, // front
            4,
            5,
            6,
            4,
            6,
            7, // back
            8,
            9,
            10,
            8,
            10,
            11, // top
            12,
            13,
            14,
            12,
            14,
            15, // bottom
            16,
            17,
            18,
            16,
            18,
            19, // right
            20,
            21,
            22,
            20,
            22,
            23, // left
        ]

        // Now send the element array to GL

        gl.bufferData(
            gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(cubeVertexIndices),
            gl.STATIC_DRAW
        )
        // const colorBuffer = gl.createBuffer()
        // gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
        // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW)
        // 更新缓冲数据
        return {
            position: squareVerticesBuffer,
            color: colorBuffer,
            cubeVertexIndices: cubeVerticesIndexBuffer,
        }
    }
    const buffers = initBuffers(gl)
    var then = 0
    var squareRotation = 0.0
    // 周期性的绘制
    function render(now) {
        now *= 0.001 //转换成秒
        const deltaTime = now - then
        then = now
        drawScene(gl, programInfo, buffers, deltaTime)

        requestAnimationFrame(render)
    }
    requestAnimationFrame(render) // 会给回调函数一个开始去执行回调函数的时刻。
    /**
     * @description: 绘制场景
     * @param {type} 渲染上下文，缓冲对象
     * @return:
     */

    function drawScene(gl, programInfo, buffers, deltaTime) {
        gl.clearColor(0.0, 0.0, 0.0, 1.0)
        // 用于设置清空颜色缓冲时的颜色值，。这些值在0到1的范围间。void gl.clearColor(red, green, blue, alpha);
        gl.clearDepth(1.0) // 类型：GLclampf。 深度值的设定，是当清除深度缓冲区的时候使用。默认值为1。
        gl.enable(gl.DEPTH_TEST) //  用于对该上下文开启深度检测。
        gl.depthFunc(gl.LEQUAL) // 激活深度比较，并且更新深度缓冲区
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
        // 绘制之前先清空canvas画布
        const fieldOfView = (45 * Math.PI) / 180 // in radians
        const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight
        const zNear = 0.1
        const zFar = 100.0
        //创建一个透视矩阵，一个特殊的矩阵
        //用于模拟照相机透视的失真。
        //视角是45度，宽/高
        //匹配画布显示大小的比率
        //可以看到0.1个单位之间的对象
        //距离摄像机100个单位。
        // gl-matrix  矩阵与向量的高性能库 http://glmatrix.net/docs/
        const projectionMatrix = mat4.create() // 返回一个4x4的矩阵
        // 注意:glmatrix.js总是有第一个参数
        // 作为接收结果
        // 生成具有给定范围的透视投影矩阵。 远传null / undefined / no值将生成无限投影矩阵
        // perspective(out, fovy, aspect, near, far)
        mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar)

        // Set the drawing position to the "identity" point, which is
        // the center of the scene.
        const modelViewMatrix = mat4.create() // 模型视图矩阵
        // Now move the drawing position a bit to where we want to
        // start drawing the square.
        mat4.translate(
            modelViewMatrix, // destination matrix
            modelViewMatrix, // matrix to translate
            [-0.0, 0.0, -6.0]
        ) // amount to translate
        mat4.rotate(
            modelViewMatrix, // destination matrix
            modelViewMatrix, // matrix to rotate
            squareRotation, // amount to rotate in radians
            [0, 0, 1]
        )
        mat4.rotate(
            modelViewMatrix, // destination matrix
            modelViewMatrix, // matrix to rotate
            squareRotation * 0.7, // amount to rotate in radians
            [0, 1, 0]
        )
        squareRotation += deltaTime
        // console.log(squareRotation,'squareRotation');

        // 告诉WebGL从position拉出位置
        // 缓冲到vertexPosition属性中。
        {
            const numComponents = 3 // 每次迭代取出3个值
            const type = gl.FLOAT // 缓冲区中的数据是32位浮点数
            const normalize = false
            const stride = 0 // 从一组值到下一组值需要多少字节
            //0 =使用上面的type和numComponents
            const offset = 0 // 缓冲区中要从多少字节开始
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position)
            gl.vertexAttribPointer(
                programInfo.attribLocations.vertexPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset
            )
            // 指定一个顶点attributes 数组中，顶点attributes 变量的数据格式和位置。
            gl.enableVertexAttribArray(
                programInfo.attribLocations.vertexPosition
            )
        }
        {
            const numComponents = 4
            const type = gl.FLOAT
            const normalize = false
            const stride = 0
            const offset = 0
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color)
            gl.vertexAttribPointer(
                programInfo.attribLocations.vertexColor,
                numComponents,
                type,
                normalize,
                stride,
                offset
            )
            gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor)
        }
        {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.cubeVertexIndices)
        }
        gl.useProgram(programInfo.program) // 对象添加到当前的渲染状态中。

        // 设置着色器
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.projectionMatrix,
            false,
            projectionMatrix
        )
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.modelViewMatrix,
            false,
            modelViewMatrix
        )
        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0)
    }
}
