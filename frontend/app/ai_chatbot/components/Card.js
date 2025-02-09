export function Card({ className, children }) {
    return (
      <div className={`bg-white shadow-md rounded-lg border p-4 ${className}`}>
        {children}
      </div>
    );
  }
  
  export function CardContent({ children, className = "" }) {
    return <div className={`p-4 ${className}.trim()`}>{children}</div>;
  }