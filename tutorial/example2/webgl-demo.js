/*
 * @Author: wang_yechao
 * @Date: 2020-02-04 22:02:18
 */
var canvas = document.querySelector('#glcanvas')
var gl = canvas.getContext('webgl')
// HTMLCanvasElement.getContext() 方法返回canvas 的上下文，如果上下文没有定义则返回 null (即浏览器不支持).
if (!gl) {
    alert(
        'Unable to initialize WebGL. Your browser or machine may not support it.'
    )
}
// 设置初始的背景色是黑色
gl.clearColor(0.0, 0.0, 0.0, 1.0)
// 清除保存颜色的缓冲区
gl.clear(gl.COLOR_BUFFER_BIT)
var vsSource =
    'void main() {' +
    '   gl_Position = vec4(0.0, 0.0, 0.0, 4.0);' + // 设置顶点坐标
    '   gl_PointSize = 10.0;' + // 设置顶点的大小
    '' +
    '}'

var fsSource =
    'void main(){' +
    '   gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);' + //设置顶点颜色
    '}'
const shaderProgram = initShaderProgram(gl, vsSource, fsSource)
gl.useProgram(shaderProgram)
gl.drawArrays(gl.POINTS, 0, 1)