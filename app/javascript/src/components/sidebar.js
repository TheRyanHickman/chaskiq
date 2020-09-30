import React, { useState, useEffect } from 'react'
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import Tooltip from 'rc-tooltip'

import icon from '../images/favicon.png'
import FilterMenu from '../components/FilterMenu'
import { signout } from '../actions/auth'
import WebSetup from '../components/webSetup'
import LangChooser from '../components/LangChooser'
import Toggle from '../components/forms/Toggle'
import {
  MoreIcon,
  BookMarkIcon,
  MessageBubbleIcon,
  ConversationIcon,

  FlagIcon,
  LoadBalancerIcon,
  FactoryIcon,
  ShuffleIcon,

  BuildingIcon,
  IntegrationsIcon,
  WebhooksIcon,
  TeamIcon,
  SettingsIcon,
  FolderIcon,
  UserWalkIcon,
  UserIcon,
  TourIcon,
  MessageIcon,
  EmailIcon,
  ApiIcon,
  CardIcon
} from '../components/icons'

import SidebarAgents from '../components/conversations/SidebarAgents'

import { toggleDrawer } from '../actions/drawer'

import I18n from '../shared/FakeI18n'

import {
  UPDATE_AGENT
} from '../graphql/mutations'
import graphql from '../graphql/client'
import { getCurrentUser } from '../actions/current_user'


function mapStateToProps (state) {
  const {
    auth,
    drawer,
    app,
    segment,
    app_users,
    current_user,
    navigation
  } = state
  const { loading, isAuthenticated } = auth
  return {
    segment,
    app_users,
    current_user,
    app,
    loading,
    isAuthenticated,
    navigation,
    drawer
  }
}

function Sidebar ({
  app,
  match,
  dispatch,
  navigation,
  current_user,
  drawer,
  history
}) {
  const { current_page, current_section } = navigation

  const [expanded, setExpanded] = useState(current_section)
  const [loading, setLoading] = useState(false)

  const [langChooser, setLangChooser] = useState(false)

  const routerListener = null

  useEffect(() => {
    setExpanded(current_section)
  }, [current_section])

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false)
  }

  function isActivePage (page) {
    /// console.log("selected page", current_page , page)
    return current_page === page
  }

  function handleSignout () {
    dispatch(signout())
  }

  const appid = `/apps/${app.key}`

  const categories = [
    {
      id: 'Dashboard',
      label: I18n.t('navigator.dashboard'),
      icon: <BuildingIcon style={{ fontSize: 30 }} />,
      url: `/apps/${app.key}`,
      hidden: true,
      children: [
        /* {
          id: 'campaigns', label: 'Mailing Campaigns',
          icon: <EmailIcon/>,
          url: `${appid}/messages/campaigns`,
          active: isActivePage("campaigns")
        } */
        {
          render: (props) => [
            <div key={'dashboard-hey'}>
              <p className="text-xs leading-5 text-white font-light"
                dangerouslySetInnerHTML={
                  { __html: I18n.t('dashboard.hey', { name: app.name }) }
                }/>
              <WebSetup />
            </div>
          ]
        }
      ]
    },
    {
      id: 'Platform',
      label: I18n.t('navigator.platform'),
      icon: <FactoryIcon style={{ fontSize: 30 }} />,
      url: `/apps/${app.key}/segments/${
        app.segments ? app.segments[0].id : ''
      }`,
      children: app.segments.map((o) => ({
        id: o.name,
        icon: null,
        url: `/apps/${app.key}/segments/${o.id}`,
        active: isActivePage(`segment-${o.id}`)
      }))
    },
    {
      id: 'Conversations',
      label: I18n.t('navigator.conversations'),
      icon: <ConversationIcon style={{ fontSize: 30 }} />,
      url: `/apps/${app.key}/conversations`,
      children: [
        {
          id: 'Conversations',
          label: I18n.t('navigator.childs.conversations'),
          icon: <MessageBubbleIcon />,
          url: `/apps/${app.key}/conversations`,
          active: isActivePage('Conversations')
        },
        {
          id: 'Assignment Rules',
          icon: <ShuffleIcon />,
          label: I18n.t('navigator.childs.assignment_rules'),
          url: `/apps/${app.key}/conversations/assignment_rules`,
          active: isActivePage('Assignment Rules')
        },
        {
          render: () => [
            <SidebarAgents/>
          ]
        }
      ]
    },
    {
      id: 'Campaigns',
      label: I18n.t('navigator.campaigns'),
      url: `/apps/${app.key}/campaigns`,
      icon: <FlagIcon style={{ fontSize: 30 }} />,
      children: [
        {
          id: 'campaigns',
          label: I18n.t('navigator.childs.mailing_campaigns'),
          icon: <EmailIcon />,
          url: `${appid}/messages/campaigns`,
          active: isActivePage('campaigns')
        },
        {
          id: 'user_auto_messages',
          label: I18n.t('navigator.childs.in_app_messages'),
          icon: <MessageIcon />,
          url: `${appid}/messages/user_auto_messages`,
          active: isActivePage('user_auto_messages')
        },
        {
          id: 'tours',
          label: I18n.t('navigator.childs.guided_tours'),
          icon: <TourIcon />,
          url: `${appid}/messages/tours`,
          active: isActivePage('tours')
        }
      ]
    },

    {
      id: 'Bot',
      label: I18n.t('navigator.routing_bots'),
      icon: <LoadBalancerIcon style={{ fontSize: 30 }} />,
      url: `/apps/${app.key}/bots/settings`,
      children: [
        {
          id: 'For Leads',
          label: I18n.t('navigator.childs.for_leads'),
          icon: <UserWalkIcon />,
          url: `${appid}/bots/leads`,
          active: isActivePage('botleads')
        },
        {
          id: 'For Users',
          label: I18n.t('navigator.childs.for_users'),
          icon: <UserIcon />,
          url: `${appid}/bots/users`,
          active: isActivePage('botusers')
        },
        {
          id: 'Settings',
          label: I18n.t('navigator.childs.bot_settings'),
          icon: <SettingsIcon />,
          url: `${appid}/bots/settings`,
          active: isActivePage('botSettings')
        }
      ]
    },

    {
      label: I18n.t('navigator.help_center'),
      id: 'HelpCenter',
      icon: <BookMarkIcon style={{ fontSize: 30 }} />,
      url: `/apps/${app.key}/articles`,
      children: [
        {
          id: 'Articles',
          label: I18n.t('navigator.childs.articles'),
          icon: <BookMarkIcon />,
          url: `/apps/${app.key}/articles`,
          active: isActivePage('Articles')
        },
        {
          id: 'Collections',
          label: I18n.t('navigator.childs.collections'),
          icon: <FolderIcon />,
          url: `/apps/${app.key}/articles/collections`,
          active: isActivePage('Collections')
        },
        {
          id: 'Settings',
          label: I18n.t('navigator.childs.article_settings'),
          icon: <SettingsIcon />,
          url: `/apps/${app.key}/articles/settings`,
          active: isActivePage('Settings')
        }
      ]
    },

    {
      id: 'Settings',
      label: I18n.t('navigator.settings'),
      icon: <SettingsIcon style={{ fontSize: 30 }} />,
      url: `/apps/${app.key}/settings`,
      children: [
        {
          id: 'App Settings',
          label: I18n.t('navigator.childs.app_settings'),
          icon: <SettingsIcon />,
          url: `/apps/${app.key}/settings`,
          active: isActivePage('app_settings')
        },
        {
          id: 'Team',
          label: I18n.t('navigator.childs.team'),
          icon: <TeamIcon />,
          url: `/apps/${app.key}/team`,
          active: isActivePage('team')
        },
        {
          id: 'Integrations',
          label: I18n.t('navigator.childs.integrations'),
          icon: <IntegrationsIcon />,
          url: `/apps/${app.key}/integrations`,
          active: isActivePage('integrations')
        },
        {
          id: 'Webhooks',
          label: I18n.t('navigator.childs.webhooks'),
          icon: <WebhooksIcon />,
          url: `/apps/${app.key}/webhooks`,
          active: isActivePage('webhooks')
        },
        {
          id: 'Api access',
          label: I18n.t('navigator.childs.api_access'),
          icon: <ApiIcon />,
          url: `/apps/${app.key}/oauth_applications`,
          active: isActivePage('oauth_applications')
        },
        {
          id: 'Billing',
          icon: <CardIcon />,
          hidden: !app.subscriptionsEnabled,
          url: `/apps/${app.key}/billing`,
          active: isActivePage('billing')
        }
        // { id: 'Authentication', icon: <ShuffleIcon />, active: isActivePage("user_auto_messages")},
      ]
    }
  ]

  function handleDrawer () {
    dispatch(toggleDrawer({ open: !drawer.open }))
  }

  function renderInner () {
    return categories
      .filter((o) => o.id === current_section)
      .map(({ id, label, icon, children }) => {
        //  expanded={expanded === id}
        return (
          <div
            key={`sidebar-section-${id}`}
            className="h-0-- flex-1 flex flex-col pt-5 pb-4 overflow-y-auto"
          >
            <div className="flex items-center flex-shrink-0 px-4
              text-lg leading-6 font-bold text-gray-900">
              <h3 className="font-bold">{label}</h3>
            </div>
            <nav className="mt-5 flex-1 px-4">
              {children.filter((o)=> !o.hidden ).map(
                ({ id: childId, label, icon, active, url, onClick, render }) =>
                  !render ? (
                    <Link
                      key={`sidebar-section-child-${id}-${childId}`}
                      to={url}
                      className={`
                        ${
                          active ? 'bg-white' : ''
                        } hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:bg-gray-200
                        group flex items-center px-2 py-2 text-sm leading-5 font-medium text-gray-900 
                        rounded-md transition ease-in-out duration-150`}
                    >
                      {/* <svg className="mr-3 h-6 w-6 text-gray-500 group-hover:text-gray-500 group-focus:text-gray-600 transition ease-in-out duration-150" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V10M9 21h6"/>
                          </svg> */}
                      <div className="mr-3 h-6 w-6 text-gray-500 group-hover:text-gray-500 group-focus:text-gray-600 transition ease-in-out duration-150">
                        {icon}
                      </div>

                      {label || childId}
                    </Link>
                  ) : (
                    render()
                  )
              )}
            </nav>
          </div>
        )
      })
  }

  function openLangChooser () {
    setLangChooser(true)
  }

  function handleAwaymode (e) {
    setLoading(true)

    graphql(UPDATE_AGENT, {
      appKey: app.key,
      email: current_user.email,
      params: {
        available: !current_user.available
      }
    }, {
      success: (data) => {
        dispatch(getCurrentUser())
        setLoading(false)
      },
      error: () => {
        setLoading(false)
      }
    })
  }

  const drawerClass = !drawer.open
    ? 'hidden'
    : 'absolute flex md:flex-shrink-0 z-50 h-screen'

  return (
    <div className={`${drawerClass} md:flex md:flex-shrink-0`}>
      {app && (
        <div
          className={
            `md:block border-r 
            bg-gray-200 
            text-purple-lighter 
            flex-none w-23 
            p-2 
            overflow-y-auto--`
          }
        >
          <div className="cursor-pointer mb-4">
            <div className="h-12 w-12 flex items-center justify-center text-black text-2xl font-semibold rounded-lg mb-1 overflow-hidden">
              <Link to={'/apps'}>
              <svg class="sidebarlogo" width="92px" height="38px" viewBox="0 0 92 38" version="1.1" xmlns="http://www.w3.org/2000/svg" >
                <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <path d="M45.16,0.155391772 C49.28,-0.164608228 53.45,0.115391772 57.57,0.0753917722 C59.64,8.20539177 61.12,16.5553918 63.64,24.5553918 C65.77,16.4453918 67.52,8.23539177 69.47,0.0753917722 C73.57,0.0253917722 77.68,0.0253917722 81.78,0.0753917722 C84.89,12.2053918 88.11,24.3053918 91.22,36.4353918 C87.34,36.4553918 83.46,36.4653918 79.59,36.4653918 C77.86,27.9553918 76.61,19.3453918 74.74,10.8553918 C72.36,19.2553918 70.88,27.9253918 68.88,36.4253918 C65.21,36.4653918 61.54,36.4753918 57.87,36.4453918 C56.07,28.5353918 54.28,20.6253918 52.61,12.6853918 C50.22,20.0653918 48.87,27.6253918 47.32,35.0953918 C47.15,36.0153918 46.72,36.6253918 46.04,36.9353918 C41.93,37.2553918 37.76,36.9753918 33.64,37.0053918 C31.58,28.8753918 30.1,20.5253918 27.58,12.5353918 C25.45,20.6453918 23.7,28.8553918 21.75,37.0153918 C17.65,37.0653918 13.54,37.0653918 9.44,37.0153918 C6.33,24.8853918 3.11,12.7853918 0,0.655391772 C3.88,0.635391772 7.76,0.625391772 11.64,0.625391772 C13.37,9.07539177 14.56,17.6453918 16.47,26.0553918 C18.95,17.7453918 20.32,9.09539177 22.34,0.665391772 C26.01,0.625391772 29.68,0.625391772 33.35,0.645391772 C35.15,8.55539177 36.94,16.4653918 38.61,24.4053918 C40.81,17.4953918 42.27,10.3253918 43.6,3.20539177 C43.92,2.02539177 43.93,0.765391772 45.16,0.155391772 Z" id="p6" fill="#0BFB37"></path>
                </g>
             </svg>
              </Link>
            </div>
          </div>

          <div className="overflow-y-auto h-full">
            {categories.map((o) => (
              <Tooltip
                key={`sidebar-categories-${o.id}`}
                placement="right"
                overlay={o.label}
              >
                <div
                  className="cursor-pointer mb-4 p-3
                          bg-gray-200 hover:bg-gray-100 rounded-md"
                >
                  {o.url && (
                    <Link
                      to={`${o.url}`}
                      aria-label={o.label}
                      className="bg-indigo-lighter
                      h-12 w-12 flex-- items-center
                      justify-center-- text-black
                      text-2xl font-semibold rounded-lg
                      mb-1 overflow-hidden text-gray-400"
                    >
                      {o.icon}
                    </Link>
                  )}
                </div>
              </Tooltip>
            ))}
          </div>
        </div>
      )}

      { langChooser &&
        <LangChooser
          open={langChooser}
          handleClose={setLangChooser}
        />
      }

      <div className="md:flex flex-col w-56 border-r border-gray-200 bg-gray-100 shadow-inner">
        {renderInner()}

        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <a href="#" className="flex-shrink-0 group block focus:outline-none">
            <div className="flex items-center">
              <div>
                <img
                  className="inline-block h-9 w-9 rounded-full"
                  src={current_user.avatarUrl}
                  alt=""
                  width={40}
                  height={40}
                />
              </div>
              <div className="ml-3 w-2/5 flex flex-wrap">
                <p className="text-sm leading-5 font-medium text-gray-700 group-hover:text-gray-900 truncate">
                  {current_user.email}
                </p>


                <div className="flex items-center">
                  <Toggle
                    id="user-away-mode-toggle"
                    text={
                      <span className="text-xs text-gray-500">
                        Away mode
                      </span>
                    }
                    checked={current_user.available}
                    disabled={loading}
                    onChange={handleAwaymode}
                  />

                  <FilterMenu
                    options={[
                      {
                        title: I18n.t('navigator.user_menu.create_app'),
                        description: I18n.t('navigator.user_menu.create_app_description'),
                        // icon: <SendIcon />,
                        id: 'new-app',
                        onClick: () => history.push('/apps/new')
                      },

                      {
                        id: 'choose-lang',
                        title: I18n.t('home.choose_lang'),
                        onClick: openLangChooser
                      },
                      {
                        title: I18n.t('navigator.user_menu.signout'),
                        // description: "delivers the campaign",
                        // icon: <SendIcon />,
                        id: 'sign-out',
                        onClick: handleSignout
                      }
                    ]}
                    value={null}
                    filterHandler={(e) => e.onClick && e.onClick() }
                    triggerButton={(handler) => (
                      <button
                        onClick={handler}
                        id="user_menu"
                        className="text-xs leading-4 font-medium text-gray-500 group-hover:text-gray-700 group-focus:underline transition ease-in-out duration-150">
                        <div className="flex items-center">
                          {/*
                            I18n.t('navigator.user_menu.title')
                          */}
                          <MoreIcon/>
                        </div>

                      </button>
                    )}
                    position={'left'}
                    origin={'bottom-0'}
                  />
                </div>

              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}

export default withRouter(connect(mapStateToProps)(Sidebar))
