import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appPinkGlow]',
  standalone: true,
})
export class PinkGlowDirective implements OnChanges {
  @Input() appPinkGlow = false;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnChanges(): void {
    if (this.appPinkGlow) {
      this.renderer.setStyle(this.el.nativeElement, 'border', '1px solid rgba(255, 105, 180, 0.55)');
      this.renderer.setStyle(this.el.nativeElement, 'box-shadow', '0 0 18px rgba(255, 105, 180, 0.25)');
    } else {
      this.renderer.removeStyle(this.el.nativeElement, 'border');
      this.renderer.removeStyle(this.el.nativeElement, 'box-shadow');
    }
  }
}
