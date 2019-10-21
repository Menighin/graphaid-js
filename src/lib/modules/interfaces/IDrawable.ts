import DrawerModule from "@modules/drawerModule/DrawerModule";

export default interface IDrawable {
    draw(drawerModule: DrawerModule): void
}