/*
 * @Author: wang_yechao
 * @Date: 2020-02-04 22:04:17
 */
var canvas = document.querySelector('#glcanvas')
var gl = canvas.getContext('webgl')
// HTMLCanvasElement.getContext() 方法返回canvas 的上下文，如果上下文没有定义则返回 null (即浏览器不支持).
if (!gl) {
    alert(
        'Unable to initialize WebGL. Your browser or machine may not support it.'
    )
}

var vsSource =
    'attribute vec4 aVertexPosition;' +
    'void main() {' +
    '   gl_Position = aVertexPosition ;' + // 设置顶点坐标
    '   gl_PointSize = 20.0;' + // 设置顶点的大小
    '' +
    '}'

var fsSource =
    'void main(){' +
    '   gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);' + //设置顶点颜色
    '}'
const shaderProgram = initShaderProgram(gl, vsSource, fsSource)
function initBuffers(gl) {
    const squareVerticesBuffer = gl.createBuffer() // 创建 WebGLBuffer 对象
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer) // 把 WebGLBuffer 对象绑定到指定目标上。
    const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0]
    var n = positions.length / 2
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
    // bufferData方法用于向当前缓冲区传递数据，
    // WebGL并不能直接操作JS数组，我们需要把它转换成类型化数组然后载入缓冲区
    const vertexPosition = gl.getAttribLocation(
        shaderProgram,
        'aVertexPosition'
    )
    gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(vertexPosition)
    return n
}
const n = initBuffers(gl)
gl.useProgram(shaderProgram)
// 设置初始的背景色是黑色
gl.clearColor(0.0, 0.0, 0.0, 1.0)
// 清除保存颜色的缓冲区
gl.clear(gl.COLOR_BUFFER_BIT)
gl.drawArrays(gl.POINTS, 0, n)
