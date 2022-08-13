module ApplicationHelper

  def call_types_raw
    ['phone', 'sms', 'email']
  end

  def call_types
    t(call_types_raw, scope: 'defines.call_types')
  end

  def call_types_for_select
    call_types.zip(call_types_raw)
  end

end
