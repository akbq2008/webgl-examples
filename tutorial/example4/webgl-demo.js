main()
function main() {
    var canvas = document.querySelector('#glcanvas')
    var gl = canvas.getContext('webgl')
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
        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;

        void main() {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        }
            `
    // 片段着色器
    const fsSource = `
        void main() {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
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
        },
        // getAttribLocation方法获取 attribute 变量 存储地址
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(
                shaderProgram,
                'uProjectionMatrix'
            ),

            modelViewMatrix: gl.getUniformLocation(
                shaderProgram,
                'uModelViewMatrix'
            ),
            // 获取uniform 变量  uModelViewMatrix，gl.getUniformLocation(program, name)可以获取 uniform变量的存储地址
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
        const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0]
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(positions),
            gl.STATIC_DRAW
        )
        // bufferData方法用于向当前缓冲区传递数据，
        // WebGL并不能直接操作JS数组，我们需要把它转换成类型化数组然后载入缓冲区
        return {
            position: squareVerticesBuffer,
        }
    }
    const buffers = initBuffers(gl)
    drawScene(gl, programInfo, buffers)
    /**
     * @description: 绘制场景
     * @param {type} 渲染上下文，缓冲对象
     * @return:
     */

    function drawScene(gl, programInfo, buffers) {
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

        // 告诉WebGL从position拉出位置
        // 缓冲到vertexPosition属性中。
        {
            const numComponents = 2 // 每次迭代取出2个值
            const type = gl.FLOAT // 缓冲区中的数据是32位浮点数
            const normalize = false // false表示我们的数据已经是介于-1.0~1.0的gl.FLOAT类型，不需要规范化
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
            // aVertexPosition需要接收顶点的位置信息，但是我们的顶点数组包含了位置和颜色两种信息，所以需要调用vertexAttribPointer把位置信息提取出来
            gl.enableVertexAttribArray(
                programInfo.attribLocations.vertexPosition
            )
            // 为了使顶点着色器能够访问缓冲区的数据
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
        // uniformMatrix4fv用于将模型视图矩阵modelViewMatrix写入相应的内存。false参数表示不需要转置（行变列，列变行）这个矩阵，WebGL要求这个参数必须设置为false。

        {
            const offset = 0
            const vertexCount = 4
            gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount)
        }
    }
}
