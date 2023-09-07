import { Box, Slider as EagsSlider, EventBox, EventBoxClass, Label } from "eags";
import { cc } from "../Utils";

export interface Props {
    showLabel?: boolean
    label?: (value: number) => string
    vertical?: boolean
    className?: string
    innerClassName?: string
    labelClassName?: string
    scaleClassName?: string
    initialValue: number
    onChange?: (value: number) => (number | void)
    scrollIncrement?: number
    roundOnScroll?: number
    props?: Partial<EventBoxClass>
    min?: number
    max?: number
}

export const Scale = (props: Props) => {
    function getLabel(value: number) {
        if (props.label) {
            return props.label(value);
        }
        return `${value}`;
    }

    const label = props.showLabel !== false ? Label({
        label: getLabel(props.initialValue),
        className: 'E-Scale-label' + cc(props.labelClassName, props.labelClassName)
    }) : null;

    const slider = EagsSlider({
        hexpand: !props.vertical,
        vexpand: !!props.vertical,
        max: props.max ?? 100,
        min: props.min ?? 0,
        value: props.initialValue,
        drawValue: false,
        vertical: !!props.vertical,
        className: 'E-Scale-scale' + cc(props.vertical, 'E-Scale-vertical') + cc(props.scaleClassName, props.scaleClassName),
        // @ts-ignore
        inverted: !!props.vertical,
        // @ts-ignore
        onChange: ({value}) => {
            if (props.onChange) {
                value = props.onChange(value);
            }
            if (label) {
                label.label = getLabel(value);
            }
        }
    })

    return EventBox({
        ...props.props,
        className: 'E-EventBox' + cc(props.className, props.className),
        child: Box({
            className: 'E-Scale' + cc(props.innerClassName, props.innerClassName),
            vertical: !!props.vertical,
            halign: props.vertical ? 'start' : 'fill',
            valign: props.vertical ? 'fill' : 'start',
            children: [
                slider,
                label
            ]
        }),
        onScrollDown: () => {     
            if (!props.scrollIncrement) return;

            let value = Math.min(Math.max(slider.value! - props.scrollIncrement, props.min ?? 0), props.max ?? 100);
            if (props.roundOnScroll) {
                value = Math.round(value / props.roundOnScroll) * props.roundOnScroll;
            }
            
            if (props.onChange) {
                const newValue = props.onChange(value);
                if (typeof newValue == 'number') {
                    slider.value = newValue;
                }
            } else {
                slider.value = value;
            }
            if (label) {
                label.label = getLabel(slider.value!);
            }
        },
        onScrollUp: () => {
            if (!props.scrollIncrement) return;

            let value = Math.min(Math.max(slider.value! + props.scrollIncrement, props.min ?? 0), props.max ?? 100);
            if (props.roundOnScroll) {
                value = Math.round(value / props.roundOnScroll) * props.roundOnScroll;
            }
            
            if (props.onChange) {
                const newValue = props.onChange(value);
                if (typeof newValue == 'number') {
                    slider.value = newValue;
                }
            } else {
                slider.value = value;
            }
            if (label) {
                label.label = getLabel(slider.value!);
            }
        }
    })
}