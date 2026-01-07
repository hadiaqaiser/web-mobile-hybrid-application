import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
    selector: '[appGlowShadow]',
    standalone: true,
})
export class GlowShadowDirective {
    constructor(private el: ElementRef, private r: Renderer2) {
        this.r.setStyle(this.el.nativeElement, 'box-shadow', '0 12px 30px rgba(255, 105, 180, 0.15)');
        this.r.setStyle(this.el.nativeElement, 'border-radius', '16px');
    }
}