/*
 * @Author: wang_yechao
 * @Date: 2020-02-04 21:18:19
 */


/**
 * @description: 初始化着色器程序，让WebGL知道如何绘制我们的数据
 * @param {type} 渲染上下文,顶点着色器,文档着色器
 * @return:
 */
function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource)
    // gl.VERTEX_SHADER 顶点着色器
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource)
    // gl.FRAGMENT_SHADER 片段着色器
    const shaderProgram = gl.createProgram() // 创建着色器程序
    gl.attachShader(shaderProgram, vertexShader) // 把 WebGLShader 添加到 WebGLProgram。
    gl.attachShader(shaderProgram, fragmentShader) // 把 WebGLShader 添加到 WebGLProgram。
    gl.linkProgram(shaderProgram) // 链接给入的 WebGLProgram 对象。
    // 创建失败， alert
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert(
            'Unable to initialize the shader program: ' +
                gl.getProgramInfoLog(shaderProgram)
        )
        return null
    }

    return shaderProgram
}

/**
* @description: 创建指定类型的着色器，上传source源码并编译
* @param {type} 渲染上下文，着色器类型，数据源
* @return:{
position: squareVerticesBuffer,
}
*/

function loadShader(gl, type, source) {
    const shader = gl.createShader(type) // 创建着色器对象
    gl.shaderSource(shader, source) // 提供数据源
    gl.compileShader(shader) // 编译 -> 生成着色器
    // 如果编译失败就弹窗
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        // gl.getShaderParameter(shader, gl.COMPILE_STATUS) 返回给定的着色器信息  COMPILE_STATUS 着色器是否编译成功，是（GL_TRUE）不是（GL_FALSE）
        // https://developer.mozilla.org/zh-CN/docs/Web/API/WebGLRenderingContext/getShaderParameter
        alert(
            'An error occurred compiling the shaders: ' +
                gl.getShaderInfoLog(shader)
        )
        // gl.getShaderInfoLog(shader)  返回 WebGLShader 对象的信息日志。
        gl.deleteShader(shader)
        return null
    }
    return shader
}
