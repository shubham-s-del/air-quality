export default ({ color, children, background }) => (
  <p>
    {children}
    <style jsx>{`
      p {
        margin-top: 80px;
        margin-bottom: -80px
        color: ${color || 'inherit'};
        background: ${background || 'inherit'};
        text-align: center;
        font-size: xx-large;
      }
    `}</style>
  </p>
)
