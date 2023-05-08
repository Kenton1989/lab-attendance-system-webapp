import { useRootPageTitle } from "../root-page-context";

export default function DummyComponent(props: { title?: string }): JSX.Element {
  let { title = "Lorem Ipsum" } = props;
  // useRootPageTitle([title]);

  return (
    <>
      <h1>{title}</h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed rutrum non
        augue in volutpat. Nunc maximus vel sapien eu consectetur. Etiam
        ullamcorper, lectus aliquet mollis tincidunt, nisl lacus tempus arcu,
        non auctor justo risus in turpis. Donec mattis orci vel lectus tempus
        rutrum. Sed pulvinar vel metus ut interdum. Aliquam erat volutpat.
        Maecenas augue quam, auctor at maximus sit amet, lobortis sed nisi.
        Aenean auctor ultricies ligula eget fermentum. Interdum et malesuada
        fames ac ante ipsum primis in faucibus. Nullam ut tortor id neque
        placerat varius. In at dui eu nibh pretium mollis. Aenean vel
        sollicitudin velit, a pulvinar nisi. Donec finibus lacus arcu, ornare
        tempor enim accumsan ac.
      </p>
      <p>
        Donec eget pharetra lectus, ut posuere ex. Nullam ipsum mi, pulvinar a
        mauris vel, interdum faucibus metus. Maecenas blandit elit at lacinia
        tempor. Praesent tincidunt est sem, non pellentesque leo dignissim
        commodo. Integer eget pulvinar tortor. Maecenas semper volutpat libero
        vitae commodo. Cras vel massa hendrerit, lacinia lacus malesuada,
        venenatis mi. Fusce sed ultricies nisi, vel iaculis elit. Vivamus
        lacinia velit turpis, at ornare nibh tempus at. Proin placerat, justo in
        rutrum convallis, purus velit placerat urna, nec ultricies neque orci
        vitae urna. Ut ultricies nisi ligula, eu pellentesque leo volutpat et.
        Donec scelerisque vitae massa sed facilisis. In feugiat magna a
        imperdiet aliquam. Sed arcu tortor, semper quis consectetur et, gravida
        et lectus.
      </p>
    </>
  );
}
