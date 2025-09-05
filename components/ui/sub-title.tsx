const SubTitle = ({children}: {children: React.ReactNode}) => {
  return (
    <span className="rounded-4xl p-2 px-3 font-normal text-foreground border border-border text-nowrap flex justify-center items-center gap-1">
       <span className="min-w-4 min-h-4 rounded-xs inline-block border border-border rotate-45"></span>
       {children}
       </span>
  )
}

export default SubTitle
