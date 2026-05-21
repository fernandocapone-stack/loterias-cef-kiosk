import { Outlet } from 'react-router-dom';

/**
 * Lotéricas shell — thin wrapper that renders child routes.
 *
 * The old sidebar navigation has been replaced by full-screen tab pages
 * that each render their own header.  The CartDrawer has been replaced by
 * CartPage at `/caixa/loterias/carrinho`.
 */
export default function LoteriasShell() {
  return (
    <div className="h-full w-full overflow-hidden">
      <Outlet />
    </div>
  );
}
