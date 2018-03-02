<template>
    <div :class="['vc-sketch', disableAlpha ? 'vc-sketch__disable-alpha' : '']">
        <div class="vc-ply-head">
            <div class="vc-sketch-color-wrap">
                <div class="vc-sketch-active-color" :style="{background: activeColor}"></div>
                <checkboard></checkboard>
            </div>
            <div class="vc-sketch-presets">
                <div class="vc-sketch-presets-color"
                     v-for="c in presetColors"
                     :key="c"
                     :style="{background: c}"
                     @click="handlePreset(c)">
                </div>
            </div>
        </div>
        <div class="vc-sketch-saturation-wrap">
            <saturation v-model="colors" @change="childChange"></saturation>
        </div>
        <div class="vc-sketch-controls">
            <div class="vc-sketch-sliders">
                <div class="vc-sketch-hue-wrap">
                    <hue v-model="colors" @change="childChange"></hue>
                </div>
                <div class="vc-sketch-alpha-wrap" v-if="!disableAlpha">
                    <alpha v-model="colors" @change="childChange"></alpha>
                </div>
            </div>
        </div>
        <div class="vc-sketch-field" v-if="!disableFields">
            <!-- rgba -->
            <div class="vc-sketch-field--double">
                <ed-in :value="hex" @change="inputChange"></ed-in>
            </div>
        </div>
        <div class="vc-sketch-field" v-if="!disableFields && !disableAlpha">
            <!-- rgba -->
            <div class="vc-sketch-field--single">
                <ed-in label="r" :value="colors.rgba.r" @change="inputChange"></ed-in>
            </div>
            <div class="vc-sketch-field--single">
                <ed-in label="g" :value="colors.rgba.g" @change="inputChange"></ed-in>
            </div>
            <div class="vc-sketch-field--single">
                <ed-in label="b" :value="colors.rgba.b" @change="inputChange"></ed-in>
            </div>
            <div class="vc-sketch-field--single" v-if="!disableAlpha">
                <ed-in label="a" :value="colors.a" :arrow-offset="0.01" :max="1" @change="inputChange"></ed-in>
            </div>
        </div>
    </div>
</template>

<script>
    import colorMixin from '../mixin/color'
    import editableInput from './common/EditableInput.vue'
    import saturation from './common/Saturation.vue'
    import hue from './common/Hue.vue'
    import alpha from './common/Alpha.vue'
    import checkboard from './common/Checkboard.vue'

    const presetColors = [
        '#D0021B', '#F5A623', '#F8E71C', '#8B572A'
    ]

    export default {
        name: 'Sketch',
        mixins: [colorMixin],
        components: {
            saturation,
            hue,
            alpha,
            'ed-in': editableInput,
            checkboard
        },
        props: {
            presetColors: {
                type: Array,
                default () {
                    return presetColors
                }
            },
            disableAlpha: {
                type: Boolean,
                default: true
            },
            disableFields: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            hex () {
                return this.colors.hex.replace('#', '')
            },
            activeColor () {
                var rgba = this.colors.rgba
                return 'rgba(' + [rgba.r, rgba.g, rgba.b, rgba.a].join(',') + ')'
            }
        },
        methods: {
            handlePreset (c) {
                this.colorChange({
                    hex: c,
                    source: 'hex'
                })
            },
            childChange (data) {
                this.colorChange(data)
            },
            inputChange (data) {
                if (!data) {
                    return
                }
                if (data.hex) {
                    this.isValidHex(data.hex) && this.colorChange({
                        hex: data.hex,
                        source: 'hex'
                    })
                } else if (data.r || data.g || data.b || data.a) {
                    this.colorChange({
                        r: data.r || this.colors.rgba.r,
                        g: data.g || this.colors.rgba.g,
                        b: data.b || this.colors.rgba.b,
                        a: data.a || this.colors.rgba.a,
                        source: 'rgba'
                    })
                }
            }
        }
    }
</script>

<style>
    .vc-sketch {
        position: relative;
        width: 181px;
        padding: 20px;
        box-sizing: initial;
        background: #fff;
        box-shadow: 0 0 32px -4px rgba(0,0,0,.15);
    }
    .vc-sketch-saturation-wrap {
        box-shadow: inset 0 0 0 1px rgba(0,0,0,.15);
        width: 100%;
        padding-bottom: 75%;
        position: relative;
        overflow: hidden;
        margin: 5px 0;
    }
    .vc-sketch-saturation-wrap, .vc-saturation, .vc-sketch-saturation-wrap .vc-saturation > *{
        border-radius: 2px;
    }
    .vc-sketch-controls {
        display: flex;
    }
    .vc-sketch-sliders {
        flex: 1;
    }
    .vc-sketch-sliders .vc-hue,
    .vc-sketch-sliders .vc-alpha-gradient {
        border-radius: 2px;
    }
    .vc-alpha-picker {
        height: 18px;
    }
    .vc-hue-picker {
        height: 18px;
    }
    .vc-sketch-hue-wrap {
        position: relative;
        height: 20px;
        margin: 5px 0;
    }
    .vc-sketch-alpha-wrap {
        position: relative;
        height: 20px;
        margin: 5px 0;
        overflow: hidden;
    }
    .vc-sketch-color-wrap {
        width: 24px;
        height: 24px;
        position: relative;
        border-radius: 50%;
    }
    .vc-ply-head {
        display: flex;
        margin-bottom: 12px;
        width: 181px;
    }
    .vc-sketch-active-color {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        box-shadow: inset 0 0 0 1px rgba(0,0,0,.15), inset 0 0 4px rgba(0,0,0,.25);
        z-index: 2;
        width: 24px;
        height: 24px;
        border-radius: 50%;
    }
    .vc-sketch-color-wrap .vc-checkerboard {
        background-size: auto;
        width: 24px;
        height: 24px;
        border-radius: 50%;
    }

    .vc-sketch-field {
        display: flex;
        padding-top: 4px;
    }
    .vc-sketch-field .vc-input__input {
        width: 80%;
        padding: 8px 5px;
        border: none;
        box-shadow: inset 0 0 0 1px #e6e6e6;
        font-size: 11px;
        border-radius: 2px;
        color: gray;
        text-align: center;
    }
    .vc-sketch-field--double .vc-input__input {
        padding: 8px 8px 8px 16px;
        width: 100%;
        box-sizing: border-box;
    }
    .vc-sketch-field--double  .vc-editable-input {
        position: relative;
    }
    .vc-sketch-field--double  .vc-input__label {
        display: none !important;
    }
    .vc-sketch-field--double  .vc-editable-input:before {
        content: '#';
        display: block;
        position: absolute;
        font-size: 12px;
        color: gray;
        padding: 8px;
    }
    .vc-sketch-field--single {
        padding-left: 0 !important;
    }
    .vc-sketch-field .vc-input__label {
        display: block;
        text-align: center;
        font-size: 11px;
        color: gray;
        padding-top: 3px;
        padding-bottom: 4px;
        text-transform: capitalize;
    }
    .vc-sketch-field--single {
        flex: 1;
        padding-left: 6px;
    }
    .vc-sketch-field--double {
        flex: 2;
    }
    .vc-sketch-presets {
        margin-left: 15px;
        border-left: 1px solid #f1f1f1;
        padding-left: 15px;
    }
    .vc-sketch-presets-color {
        border-radius: 50%;
        overflow: hidden;
        position: relative;
        display: inline-block;
        margin: 0 10px 0 0;
        vertical-align: top;
        cursor: pointer;
        width: 24px;
        height: 24px;
        box-shadow: inset 0 0 0 1px rgba(0,0,0,.15);
    }

    .vc-sketch-presets-color:last-child {
        margin-right: 0;
    }

    .vc-sketch__disable-alpha .vc-sketch-color-wrap {
        height: 10px;
    }
</style>
