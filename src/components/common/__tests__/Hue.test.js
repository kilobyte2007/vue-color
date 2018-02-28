import { shallow } from 'vue-test-utils'
import { createRenderer } from 'vue-server-renderer'
import randomInt from 'random-int'

import Hue from '../Hue'

describe('Hue.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(Hue)
  })

  test('renders correctly', () => {
    const renderer = createRenderer()
    renderer.renderToString(wrapper.vm, (err, str) => {
      if (err) throw new Error(err)
      expect(str).toMatchSnapshot()
    })
  })

  test('has the right class in vertical mode', () => {
    wrapper.setProps({
      direction: 'vertical'
    })
    expect(wrapper.classes()).toContain('vc-hue--vertical')
  })

  test('should not exceed min and max', () => {
    wrapper.setProps({
      direction: 'vertical',
      color: {
        h: 0,
        s: randomInt(100),
        l: randomInt(100)
      }
    })

    const pointer = wrapper.find('.vc-hue-pointer')
    expect(pointer.hasStyle('bottom', '0%')).toBe(true)

    wrapper.setProps({
      direction: 'horizontal',
      color: {
        h: 360,
        s: randomInt(100),
        l: randomInt(100)
      }
    })

    expect(pointer.hasStyle('left', '0%')).toBe(true)
  })

  test('drag', () => {
    wrapper.setData({ containerSize: 100 })

    /* --- 触发顺序 -- */
    /* PC 拖拽:  mousedown(handleMouseDown) -> onDragStart -> onDragging * n -> onDragEnd */
    /* PC 点击:  mousedown(handleMouseDown) -> onDragStart -> onDragEnd */
    /* mobile 拖拽:  mousedown(handleMouseDown) -> onDragStart -> onDragging * n -> onDragEnd */
    /* mobile 点击:  touchstart(handleMouseDown) -> onDragStart -> onDragEnd */

    wrapper.vm.handleSliderClick({ clientX: 60, clientY: 0, preventDefault () {} })
    expect(wrapper.vm.$data._color.hsl.h).toBe(216)

    wrapper.vm.onDragStart({ clientX: 60, clientY: 0, preventDefault () {} })
    expect(wrapper.vm.$data.startX).toBe(60)
    expect(wrapper.vm.$data.startPosition).toBe(60)
    expect(wrapper.vm.$data.dragging).toBe(true)

    wrapper.vm.onDragging({ clientX: 80, clientY: 0, preventDefault () {} })
    expect(wrapper.vm.$data._color.hsl.h).toBe(288)

    wrapper.vm.onDragEnd()
    expect(wrapper.vm.$data.dragging).toBe(false)
  })

  test('emit', () => {
    const stub = jest.fn()
    wrapper.vm.$on('change', stub)
    wrapper.vm.handleChange(1)

    expect(stub).toBeCalledWith({'a': 1, 'hex': '#4D1C19', 'hsl': {'a': 1, 'h': 3.6000000000000005, 'l': 0.2, 's': 0.5097999999999999}, 'hsv': {'a': 1, 'h': 3.6000000000000005, 's': 0.6753212346006093, 'v': 0.30196}, 'oldHue': 3.6, 'rgba': {'a': 1, 'b': 25, 'g': 28, 'r': 77}, 'source': 'hsl'})
  })
})