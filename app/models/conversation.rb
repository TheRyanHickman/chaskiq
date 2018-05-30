class Conversation < ApplicationRecord
  belongs_to :app
  belongs_to :assignee, class_name: 'User', optional: true
  belongs_to :main_participant, class_name: "User"
  has_many :messages, class_name: "ConversationPart"

  include AASM

  aasm column: :state do
    state :opened, :initial => true
    state :closed

    event :reopen do
      transitions :from => :closed, :to => :opened
    end

    event :close do
      transitions :from => :opened, :to => :closed
    end
  end

  def add_message(opts={})
    part         = self.messages.new
    part.user    = opts[:from]
    part.message = opts[:message]
    part.save
  end

  def assign_user(user)
    self.assignee = user
    self.save
  end




end