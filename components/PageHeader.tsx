interface PageHeaderProps {
  title: string;
  description: string;
  action?: React.ReactNode;
  count?: number;
}

export default function PageHeader({ title, description, action, count }: PageHeaderProps) {
  return (
    <div className="box-border flex gap-[4px] items-end px-0 py-[16px] relative size-full">
      <div className="basis-0 grow h-[44px] min-h-px min-w-px relative shrink-0">
        <div className="absolute flex items-center left-0 top-0">
          <p className="font-semibold leading-[24px] relative shrink-0 text-[#121313] text-[20px] tracking-[0.2px]">
            {title}
          </p>
          {count !== undefined && (
            <div className="bg-white border border-[#e3e7ea] rounded p-0.5 flex items-center justify-center" style={{ marginLeft: '8px' }}>
              <p className="font-medium text-xs text-[#121313] leading-4 text-center tracking-[0.12px]">
                {count > 99 ? '99+' : count}
              </p>
            </div>
          )}
        </div>
        <p className="absolute leading-[16px] left-0 not-italic text-[#6e8081] text-[12px] top-[28px] tracking-[0.12px] w-full">
          {description}
        </p>
      </div>
      {action && (
        <div className="relative shrink-0">
          {action}
        </div>
      )}
    </div>
  );
}

